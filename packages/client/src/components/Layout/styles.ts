import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing, palette, shadows }: Theme): Styles => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    height: `56px`,
    background: palette.background.paper,
    paddingLeft: `${spacing(2)}px`,
    paddingRight: `${spacing(2)}px`,
    boxShadow: shadows[3],
    zIndex: 2,
    position: "sticky",
    top: 0,
  },
  content: {
    flex: 1,
    minHeight: `calc(100vh - ${spacing(7)}px)`,
    paddingTop: `${spacing(2)}px`,
    paddingBottom: `${spacing(2)}px`,
    background: palette.background.default,
  },
  itemContent: {
    paddingTop: `${spacing(2)}px`,
    paddingBottom: `${spacing(2)}px`,
  },
});

export interface Styles {
  root: any;
  header: any;
  content: any;
  itemContent: any;
}

export const useStyles = makeStyles(styles);
