import React from "react";
import { differenceInCalendarDays } from "date-fns";
// UI Components
import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  IconButton,
  SvgIcon,
  Tooltip,
  Avatar,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { mdiGitlab } from "@mdi/js";
// Components
import BountyHandler from "./BountyHandler";
// Styles
import { useStyles } from "./styles";
// Types
import { MergeRequest } from "../controllers/mergeRequests.types";
import useUser from "hooks/useUser";
import { UseEthereumProject } from "pages/ProjectPage/controllers/useEthereumProject";

interface MergeRequestCardProps {
  mergeRequest: MergeRequest;
  ethereumProject: UseEthereumProject;
}
const MergeRequestCard = ({
  mergeRequest,
  ethereumProject,
}: MergeRequestCardProps) => {
  const { data } = useUser();

  const classes = useStyles();

  const dayAgo: number = differenceInCalendarDays(
    new Date(),
    new Date(mergeRequest.createdAt)
  );

  const isUserAuthor = data?.id === mergeRequest.author.id;

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Grid container>
            <Grid
              item
              container
              xs={12}
              md={6}
              direction="column"
              justify="space-between"
            >
              <Box display="flex" alignItems="baseline">
                <Typography aria-label="Merge request title">
                  <strong>{mergeRequest.title}</strong>
                </Typography>
                {isUserAuthor && (
                  <Typography
                    className={classes.authorBadge}
                    variant="caption"
                    aria-label="is merge request author"
                  >
                    Author
                  </Typography>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle2">
                  !{mergeRequest.iid} - opened {dayAgo} day{dayAgo > 1 && "s"}{" "}
                  ago by {mergeRequest.author.name}
                </Typography>
                <Tooltip title="See on Gitlab">
                  <IconButton
                    href={mergeRequest.webUrl}
                    className={classes.redirectIcon}
                    aria-label="Redirect to Gitlab Merge Request"
                  >
                    <SvgIcon>
                      <path d={mdiGitlab} />
                    </SvgIcon>
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item container xs={12} md={2}>
              {/* The if on the projectAddress is a workaround while we are not using key store in useCall */}
              {ethereumProject.projectAddress && ethereumProject.isMember && (
                <BountyHandler
                  ethereumProject={ethereumProject}
                  mergeRequest={mergeRequest}
                />
              )}
            </Grid>
            <Grid
              item
              container
              xs={12}
              md={4}
              direction="column"
              justify="space-between"
              alignItems="flex-end"
            >
              <Box display="flex">
                {mergeRequest.approvedBy.length === 0 ? (
                  <Typography variant="subtitle2" aria-label="No approvals">
                    No approvals yet
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2">Approvals:</Typography>
                    <AvatarGroup
                      className={classes.avatarGroup}
                      aria-label="Approvers lists"
                    >
                      {mergeRequest.approvedBy.map((user) => (
                        <Tooltip key={user.id} title={user.name}>
                          <Avatar
                            src={user.avatarUrl}
                            className={classes.avatar}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </>
                )}
              </Box>
              <Box display="flex">
                {mergeRequest.reviews.reviewedBy.length === 0 ? (
                  <Typography variant="subtitle2" aria-label="No reviews">
                    No review yet
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2">Reviewed by:</Typography>
                    <AvatarGroup
                      className={classes.avatarGroup}
                      aria-label="Reviewers lists"
                    >
                      {mergeRequest.reviews.reviewedBy.map((user) => (
                        <Tooltip key={user.id} title={user.name}>
                          <Avatar
                            src={user.avatarUrl}
                            className={classes.avatar}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default MergeRequestCard;
