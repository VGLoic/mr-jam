import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing, palette }: Theme): Styles => ({
    notFound: {
        color: palette.error.main
    },
    wrongNetwork: {
        color: palette.warning.main
    },
    correctNetwork: {
        color: palette.success.main
    },
    aloneIcon: {
        margin: `0 ${spacing(1) + spacing(1) / 2}px`
    }
});

export interface Styles {
    notFound: any;
    wrongNetwork: any;
    correctNetwork: any;
    aloneIcon: any;
}

export const useStyles = makeStyles(styles);
