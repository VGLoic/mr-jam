import { makeStyles } from "@material-ui/core";

const styles = (): Styles => ({
  hidden: {
    visibility: "hidden",
  },
});

export interface Styles {
  hidden: any;
}

export const useStyles = makeStyles(styles);
