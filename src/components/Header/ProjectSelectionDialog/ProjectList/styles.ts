import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ palette, spacing }: Theme): Styles => ({
  selectedCard: {
    borderColor: palette.success.main,
    borderWidth: "1px",
    borderStyle: "solid",
  },
  hidden: {
    visibility: "hidden",
  },
});

export interface Styles {
  selectedCard: any;
  hidden: any;
}

export const useStyles = makeStyles(styles);
