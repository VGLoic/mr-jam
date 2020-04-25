import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing, palette, transitions }: Theme): Styles => ({
    notFound: {
        color: palette.error.main,
    },
    notEnabled: {
        animation: `$alternate-red 2000ms ${transitions.easing.easeInOut} 0ms infinite`
    },
    wrongNetwork: {
        color: palette.warning.main
    },
    correctNetwork: {
        color: palette.success.main
    },
    aloneIcon: {
        margin: `0 ${spacing(1) + spacing(1) / 2}px`
    },
    "@keyframes alternate-red": {
        "0%": {
            color: "default"
        },
        "50%": {
            color: palette.error.main
        },
        "100%": {
            color: "default"
        }
    }
});

export interface Styles {
    notFound: any;
    wrongNetwork: any;
    correctNetwork: any;
    aloneIcon: any;
    "@keyframes alternate-red": any,
    notEnabled: any;
}

export const useStyles = makeStyles(styles);
