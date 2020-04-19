import React from "react";
// UI components
import { Box } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
// Styles
import { useStyles } from "./styles";


interface DateChoiceProps {
    fromDate: Date | null;
    onChangeFrom: (date: Date | null) => void;
    toDate: Date;
    onChangeTo: (date: Date) => void;
}
const DateChoice = ({
    fromDate,
    onChangeFrom,
    toDate,
    onChangeTo
}: DateChoiceProps) => {

    const classes = useStyles();

    return (
        <Box
            display="flex"
            justifyContent="flex-end"
        >
            <DatePicker
                label="From"
                value={fromDate}
                onChange={onChangeFrom}
                maxDate={toDate}
                autoOk
                disableFuture
                clearable
                className={classes.fromPicker}
            />
            <DatePicker
                label="To"
                value={toDate as Date | null}
                onChange={onChangeTo as (newDate: Date | null) => void}
                autoOk
                disableFuture
            />
        </Box>
    )
}

export default DateChoice;