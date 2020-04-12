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
  Avatar
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { mdiGitlab } from "@mdi/js";
// Styles
import { useStyles } from "./styles";
// Types
import { MergeRequest } from "../controllers/mergeRequests.types";

interface MergeRequestProps {
  mergeRequest: MergeRequest;
}
const MergeRequestCard = ({ mergeRequest }: MergeRequestProps) => {
  const classes = useStyles();

  const dayAgo: number = 
    differenceInCalendarDays(
      new Date(),
      new Date(mergeRequest.createdAt)
    )

  return (
    <Grid item xs={12} key={mergeRequest.id}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              <strong>{mergeRequest.title}</strong>
            </Typography>
            <Box display="flex">
              <Typography variant="subtitle2">Approvals:</Typography>
              <AvatarGroup className={classes.avatarGroup}>
                {mergeRequest.approvedBy.map(user => (
                  <Tooltip key={user.id} title={user.name}>
                    <Avatar src={user.avatarUrl} className={classes.avatar} />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2">
                !{mergeRequest.iid} - opened {dayAgo} day{dayAgo > 1 && "s"} ago by{" "}
                {mergeRequest.author.name}
              </Typography>
              <Tooltip title="See on Gitlab">
                <IconButton
                  href={mergeRequest.webUrl}
                  className={classes.redirectIcon}
                >
                  <SvgIcon>
                    <path d={mdiGitlab} />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </Box>
            <Box display="flex">
              <Typography variant="subtitle2">
                Reviewed by:
              </Typography>
              <AvatarGroup className={classes.avatarGroup}>
                {mergeRequest.reviews.reviewedBy.map(user => (
                  <Tooltip key={user.id} title={user.name}>
                    <Avatar src={user.avatarUrl} className={classes.avatar} />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default MergeRequestCard;
