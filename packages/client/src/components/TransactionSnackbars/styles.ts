import { makeStyles, Theme } from "@material-ui/core";

interface stylesProps {
  index: number;
}
const styles = ({ spacing }: Theme): Styles => ({
  snackbar: {
    marginBottom: ({ index }: stylesProps) => `${(spacing(2) + 48) * index}px`,
  },
});

export interface Styles {
  snackbar: any;
}

export const useStyles = makeStyles(styles);
