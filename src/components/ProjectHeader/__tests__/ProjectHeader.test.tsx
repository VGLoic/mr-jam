import React from "react";
import { render, waitFor, screen, fireEvent } from "test-utils";
import { MockedProvider } from '@apollo/client/testing';

import ProjectHeader from "../";
import { PROJECT_OVERVIEW } from "../controllers/projectOverview.query";
import { ProjectOverviewData } from "../controllers/projectOverview.types";

describe("<ProjectHeader />", () => {
    it("should render with error", async () => {
        const projectOverviewMock = {
            request: {
                query: PROJECT_OVERVIEW,
                variables: { projectId: "projectIdTest" }
            },
            error: new Error('aw shucks')
        };
        const { asFragment } = render(
            <MockedProvider mocks={[projectOverviewMock]} addTypename={false}>
                <ProjectHeader projectId="projectIdTest" />
            </MockedProvider>
        );

        await waitFor(() => screen.getByLabelText("Project with id projectIdTest has not been found"));

        expect(asFragment()).toMatchSnapshot("Project header error");
    });

    it("should render without error when there are less than 6 users", async () => {
        const projectOverviewData: ProjectOverviewData = {
            project: {
                id: "projectIdTest",
                name: "the Test Project",
                pathWithNamespace: "/test/project",
                users: [{
                    id: "userId",
                    name: "Test user",
                    avatarUrl: "Test Avatar Url"
                }]
            }
        };

        const projectOverviewMock = {
            request: {
                query: PROJECT_OVERVIEW,
                variables: { projectId: "projectIdTest" }
            },
            result: { data: projectOverviewData }
        };

        const { asFragment } = render(
            <MockedProvider mocks={[projectOverviewMock]} addTypename={false}>
                <ProjectHeader projectId="projectIdTest" />
            </MockedProvider>
        );

        expect(screen.getByLabelText("Project overview is loading")).toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot("Project Header loading");

        await waitFor(() => screen.getByLabelText("Project name: THE TEST PROJECT"))

        expect(asFragment()).toMatchSnapshot("Project Header loaded");
    });

    it("should render without error when there are more than 5 users", async () => {
        const projectOverviewData: ProjectOverviewData = {
            project: {
                id: "projectIdTest",
                name: "the Test Project",
                pathWithNamespace: "/test/project",
                users: [
                    {
                        id: "userId0",
                        name: "name0",
                        avatarUrl: "avatarUrl0"
                    },
                    {
                        id: "userId1",
                        name: "name1",
                        avatarUrl: "avatarUrl1"
                    },
                    {
                        id: "userId2",
                        name: "name2",
                        avatarUrl: "avatarUrl2"
                    },
                    {
                        id: "userId3",
                        name: "name3",
                        avatarUrl: "avatarUrl3"
                    },
                    {
                        id: "userId4",
                        name: "name4",
                        avatarUrl: "avatarUrl4"
                    },
                    {
                        id: "userId5",
                        name: "name5",
                        avatarUrl: "avatarUrl5"
                    },
                ]
            }
        };

        const projectOverviewMock = {
            request: {
                query: PROJECT_OVERVIEW,
                variables: { projectId: "projectIdTest" }
            },
            result: { data: projectOverviewData }
        };

        const { asFragment } = render(
            <MockedProvider mocks={[projectOverviewMock]} addTypename={false}>
                <ProjectHeader projectId="projectIdTest" />
            </MockedProvider>
        );

        expect(screen.getByLabelText("Project overview is loading")).toBeInTheDocument();

        await waitFor(() => screen.getByLabelText("Project name: THE TEST PROJECT"))

        fireEvent.click(screen.getByLabelText("Open project users dialog"));

        expect(asFragment()).toMatchSnapshot("Project header with user dialog open");

        expect(screen.getAllByTestId("avatar-dialog")).toHaveLength(6);
    });
})