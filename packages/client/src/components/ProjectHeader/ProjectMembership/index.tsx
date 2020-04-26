import React from "react";
import { useProjectMembership } from "./controllers/useProjectMembership";
import { CircularProgress, Typography, Button } from "@material-ui/core";

type ProjectMembershipProps = { projectName: string };
const ProjectMembership = ({ projectName }: ProjectMembershipProps) => {
    const { unable, loading, error, projectAddress } = useProjectMembership(projectName);

    if (unable) return null;

    if (loading) {
        return (
            <CircularProgress
                data-testid="project-address-loading"
                aria-label="Searching for existing project"
            />
        );
    }

    if (error) {
        return (
            <Typography
                data-testid="project-address-error"
                aria-label="There has been an error... :("
                color="textPrimary"
            >
                There has been an error... :(
            </Typography>
        )
    }
    
    if (!projectAddress) {
        return (
            <Button>
                Create a Game
            </Button>
        )
    }

    return (
        <Typography color="textPrimary">
            Yeay
        </Typography>
    )
}

export default ProjectMembership;