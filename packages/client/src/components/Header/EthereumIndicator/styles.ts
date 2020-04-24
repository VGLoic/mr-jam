import { makeStyles, Theme } from "@material-ui/core";

const styles = ({ spacing, palette }: Theme): Styles => ({
    networkBadgeContainer: {
        border: `1px solid ${palette.warning.main}`,
        padding: `${spacing(1)}px`,
        borderRadius: `${spacing(2)}px`,
    },
    networkBadgeContent: {
        color: palette.warning.main,
    },
    networkBadgeIcon: {
        marginRight: `${spacing(1)}px`
    }
});

export interface Styles {
    networkBadgeContainer: any;
    networkBadgeContent: any;
    networkBadgeIcon: any;
}

export const useStyles = makeStyles(styles);
