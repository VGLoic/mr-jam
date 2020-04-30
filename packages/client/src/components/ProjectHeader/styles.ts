import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing, shadows }: Theme): Styles => ({
  avatar: {
    height: "25px",
    width: "25px",
    boxShadow: shadows[5]
  },
  avatarWrapper: {
    display: "flex",
  },
  seeMore: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  projectTitle: {
    marginRight: `${spacing(2)}px`,
  },
  fullPathLabel: {
    marginRight: `${spacing(1)}px`,
  },
});

export interface Styles {
  avatar: any;
  avatarWrapper: any;
  projectTitle: any;
  fullPathLabel: any;
  seeMore: any;
}

export const useStyles = makeStyles(styles);
