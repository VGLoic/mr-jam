import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing, shadows, palette }: Theme): Styles => ({
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
  authorBadge: {
    marginLeft: `${spacing(2)}px`,
    color: palette.success.main,
    border: `1px solid ${palette.success.main}`,
    padding: `0 ${spacing(1)}px`,
    borderRadius: `${spacing(2)}px`,
  },
});

export interface Styles {
  avatar: any;
  redirectIcon: any;
  avatarGroup: any;
  authorBadge: any;
}

export const useStyles = makeStyles(styles);
