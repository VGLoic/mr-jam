import React from "react";
import { render, waitFor, screen, fireEvent } from "test-utils";
import { MockedProvider } from '@apollo/client/testing';
import * as _ from 'lodash';
import debounce from 'lodash/debounce';


import Header from "../";

import { CURRENT_USER } from "../controllers/currentUser.query";
import { PROJECTS } from "../ProjectSelectionDialog/controllers/projects.query";
import { CurrentUserData } from "../controllers/currentUser.types";
import { ProjectsData } from "../ProjectSelectionDialog/controllers/projects.types";

jest.mock("lodash/debounce");

describe("<Header />", () => {

    const currentUserData: CurrentUserData = {
        currentUser: {
            id: "currentUserId",
            name: "Jack Sparrow",
            avatarUrl: "currentUserAvatarUrl"
        }
    };

    const currentUserMock = {
        request: {
            query: CURRENT_USER
        },
        result: {
            data: currentUserData
        }
    };

    describe("User query", () => {
        test("it should render with error", async () => {
            const currentUserMock = {
                request: {
                    query: CURRENT_USER
                },
                error: new Error('aw shucks')
            };
            const { asFragment } = render(
                <MockedProvider mocks={[currentUserMock]} addTypename={false}>
                    <Header className="classNameTest" />
                </MockedProvider>
            );
    
            await waitFor(() => screen.getByLabelText("Header can not be displayed"))
    
            expect(asFragment()).toMatchSnapshot("Header error");
        });
    
    
        test("it should render without error", async () => {
            const { asFragment } = render(
                <MockedProvider mocks={[currentUserMock]} addTypename={false}>
                    <Header className="classNameTest" />
                </MockedProvider>
            );
    
            expect(screen.getByTestId("user-avatar-circular-progress")).toBeInTheDocument();
    
            expect(asFragment()).toMatchSnapshot("Header loading");
    
            await waitFor(() => screen.getByTestId("user-avatar"))
    
            expect(screen.getByAltText("avatar-user")).toHaveAttribute("src", "currentUserAvatarUrl");
    
            expect(asFragment()).toMatchSnapshot("Header loaded without error");
        });
    });

    test("Theme toggle", async () => {

        render(
            <MockedProvider mocks={[currentUserMock]} addTypename={false}>
                <Header className="classNameTest" />
            </MockedProvider>
        );

        await waitFor(() => screen.getByTestId("user-avatar"));

        const themeButton = await screen.findByLabelText("Switch to light mode");

        fireEvent.click(themeButton);

        expect(themeButton).toHaveAttribute("aria-label", "Switch to dark mode");
    });

    describe("Selection of a project", () => {
        test("when there is no error, we should be able to select a project", async () => {

            const noProjectsData: ProjectsData = {
                projects: {
                    __typename: "ProjectConnection",
                    pageInfo: {
                        hasNextPage: false,
                        endCursor: null
                    },
                    edges: []
                }
            };

            const projectsData: ProjectsData = {
                projects: {
                    __typename: "ProjectConnection",
                    pageInfo: {
                        hasNextPage: true,
                        endCursor: 4
                    },
                    edges: [
                        {
                            cursor: 1,
                            node: {
                                id: "1",
                                name: "First Project",
                                description: "This is my first project",
                                pathWithNamespace: "/first/project"
                            }
                        },
                        {
                            cursor: 2,
                            node: {
                                id: "2",
                                name: "Second Project",
                                description: "This is my second project",
                                pathWithNamespace: "/second/project"
                            }
                        },
                        {
                            cursor: 3,
                            node: {
                                id: "3",
                                name: "Third Project",
                                description: "This is my third project",
                                pathWithNamespace: "/third/project"
                            }
                        },
                        {
                            cursor: 4,
                            node: {
                                id: "4",
                                name: "Fourth Project",
                                description: "This is my fourth project",
                                pathWithNamespace: "/first/project"
                            }
                        }
                    ]
                }
            }

            const moreProjectsData: ProjectsData = {
                projects: {
                    __typename: "ProjectConnection",
                    pageInfo: {
                        hasNextPage: false,
                        endCursor: null
                    },
                    edges: [
                        {
                            cursor: 5,
                            node: {
                                id: "5",
                                name: "Fifth Project",
                                description: "This is my fifth project",
                                pathWithNamespace: "/fifth/project"
                            }
                        }
                    ]
                }
            }

            const noProjectsMock = {
                request: {
                    query: PROJECTS,
                    notifyOnNetworkStatusChange: true,
                    variables: {
                        search: 'whatwhatwhat',
                        first: 3,
                        after:  0
                    },
                },
                result: {
                    data: noProjectsData
                }
            }

            const projectsMock = {
                request: {
                    query: PROJECTS,
                    notifyOnNetworkStatusChange: true,
                    variables: {
                        search: 'project',
                        first: 3,
                        after:  0
                    },
                },
                result: {
                    data: projectsData
                }
            };

            const moreProjectsMock = {
                request: {
                    query: PROJECTS,
                    notifyOnNetworkStatusChange: true,
                    variables: {
                        search: 'project',
                        first: 3,
                        after:  4
                    },
                },
                result: {
                    data: moreProjectsData
                }
            };

            (debounce as any).mockImplementation(jest.fn(
                (fn: any) => {
                    return fn as (((...args: any[]) => any) & _.Cancelable);
                }
            ));

            const { asFragment } = render(
                <MockedProvider mocks={[noProjectsMock, currentUserMock, projectsMock, moreProjectsMock]}>
                    <Header className="classNameTest" />
                </MockedProvider>
            );

            await waitFor(() => screen.getByTestId("user-avatar"));

            // Open dialog
            fireEvent.click(screen.getByLabelText("Select a project"));

            // Change the input which will bring no results
            fireEvent.change(await screen.findByLabelText("Project name"), {
                target: { value: "whatwhatwhat" }
            });

            expect(screen.getByTestId("research-loading")).toBeInTheDocument();

            expect(asFragment()).toMatchSnapshot("Projects initial search loading");

            await waitFor(() => screen.getByLabelText("No project has been found"));

            expect(asFragment()).toMatchSnapshot("No projects found");

            // Change the input again which will bring results
            fireEvent.change(await screen.findByLabelText("Project name"), {
                target: { value: "project" }
            });
            expect(screen.getByTestId("research-loading")).toBeInTheDocument();

            expect(asFragment()).toMatchSnapshot("Projects second search loading");

            await waitFor(() => screen.getByLabelText("Choose project First Project, id 1, path /first/project"));

            expect(asFragment()).toMatchSnapshot("Projects search success");

            // Load more projects with the same search
            fireEvent.click(screen.getByLabelText("Load more projects"));

            expect(screen.getByTestId("load-more-loading")).toBeInTheDocument();

            expect(asFragment()).toMatchSnapshot("Load more projects loading");

            await waitFor(() => screen.getByLabelText("Choose project Fifth Project, id 5, path /fifth/project"));

            expect(asFragment()).toMatchSnapshot("Load more projects success");

            // Select the third result
            fireEvent.click(screen.getByLabelText("Choose project Third Project, id 3, path /third/project"));

            expect(asFragment()).toMatchSnapshot("One project selected");

            fireEvent.click(screen.getByLabelText("Confirm selection of project id 3"));

            expect(asFragment()).toMatchSnapshot("One project selection confirmed");

            // Reopen and close the dialog
            fireEvent.click(screen.getByLabelText("Select a project"));

            fireEvent.click(screen.getByLabelText("Close dialog, stop selection of project"));
        })
    })
});