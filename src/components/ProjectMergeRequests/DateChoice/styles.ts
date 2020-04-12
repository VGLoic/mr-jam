import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing }: Theme): Styles => ({
  fromPicker: {
    marginRight: `${spacing(3)}px`,
  },
});

export interface Styles {
  fromPicker: any;
}

export const useStyles = makeStyles(styles);
