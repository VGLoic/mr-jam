import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing }: Theme): Styles => ({
  paperScrollPaper: {
    minHeight: "500px",
    width: "900px",
  },
  divider: {
      margin: `${spacing(4)}px 0`
  },
  avatar: {
    height: "25px",
    width: "25px",
    marginRight: `${spacing(1)}px`
  },
  confirmButton: {
    minWidth: "80px"
  },
  additionalUsersContainer: {
    marginTop: `${spacing(2)}px`
  },
  userChip: {
    marginRight: `${spacing(1)}px`,
    marginBottom: `${spacing(1)}px`
  },
  tooltip: {
    maxWidth: "none"
  }
});

export interface Styles {
  paperScrollPaper: any;
  divider: any;
  avatar: any;
  confirmButton: any;
  additionalUsersContainer: any;
  userChip: any;
  tooltip: any;
}

export const useStyles = makeStyles(styles);
