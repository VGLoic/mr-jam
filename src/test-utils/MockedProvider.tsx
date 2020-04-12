import React from "react";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "contexts/theme";


export interface MockedProviderProps {
    children?: React.ReactElement;
}
const MockedProvider = ({ children }: MockedProviderProps) => {
    return (
        <Router>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <CssBaseline />
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </MuiPickersUtilsProvider>
        </Router>
    )
}

export default MockedProvider;