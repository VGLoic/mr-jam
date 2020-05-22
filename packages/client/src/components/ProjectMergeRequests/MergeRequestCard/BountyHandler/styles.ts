import { makeStyles } from "@material-ui/core";

const styles = (): Styles => ({
  paperScrollPaper: {
    minHeight: "250px",
    width: "500px",
  },
});

export interface Styles {
  paperScrollPaper: any;
}

export const useStyles = makeStyles(styles);
