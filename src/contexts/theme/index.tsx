import React, { useState, createContext, useContext } from "react";
import {
  createMuiTheme,
  Theme,
  ThemeProvider as MuiThemeProvider
} from "@material-ui/core/styles";

const defaultMuiTheme = createMuiTheme({});

const darkMuiTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

interface IContext {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext: React.Context<any> = createContext(undefined);

type ThemeProviderProps = any;
export const ThemeProvider = (props: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const theme: Theme = isDarkMode ? darkMuiTheme : defaultMuiTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <MuiThemeProvider theme={theme} {...props} />
    </ThemeContext.Provider>
  );
};

interface UseTheme {
  isDarkMode: boolean;
  toggleMode: () => void;
}

export const useTheme = () => {
  const context: IContext = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used in a child of the ThemeProvider");
  }

  const toggleMode: () => void = () =>
    context.setIsDarkMode(isDarkMode => !isDarkMode);

  return {
    isDarkMode: context.isDarkMode,
    toggleMode
  };
};
