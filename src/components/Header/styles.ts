import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing, shadows }: Theme): Styles => ({
  avatar: {
    height: "25px",
    width: "25px",
    marginLeft: `${spacing(2)}px`,
    borderRadius: "50%",
    boxShadow: shadows[5],
  },
  nyanCat: {
    height: "25px",
    width: "auto",
  },
});

export interface Styles {
  avatar: any;
  nyanCat: any;
}

export const useStyles = makeStyles(styles);
