import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing, shadows }: Theme): Styles => ({
  avatar: {
    height: "25px",
    width: "25px",
    borderRadius: "50%",
    boxShadow: shadows[5],
  },
  redirectIcon: {
    marginLeft: `${spacing(1)}px`,
  },
  avatarGroup: {
    marginLeft: `${spacing(2)}px`,
  },
});

export interface Styles {
  avatar: any;
  redirectIcon: any;
  avatarGroup: any;
}

export const useStyles = makeStyles(styles);
