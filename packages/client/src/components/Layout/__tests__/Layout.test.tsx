import React from "react";
import { render, waitFor, screen } from "test-utils";
import Layout from "..";
import { MockedProvider } from '@apollo/client/testing';
import { CURRENT_USER } from "hooks/useUser/currentUser.query";
import { CurrentUserData } from "hooks/useUser/currentUser.types";


describe("<Layout />", () => {
    test("it should match snapshot", async () => {
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

        const { asFragment } = render(
            <MockedProvider mocks={[currentUserMock]}>
                <Layout>
                    <div data-testid="children-test" />
                </Layout>
            </MockedProvider>
        );

        await waitFor(() => screen.getByTestId("user-avatar"))

        expect(asFragment()).toMatchSnapshot("Layout");
    })
})