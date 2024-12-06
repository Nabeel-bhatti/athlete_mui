import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        // Brand
        indigoGradient: {
          100: "#e2d7f5",
          200: "#c5b0ea",
          300: "#a888e0",
          400: "#8b61d5",
          500: "#6e39cb",
          600: "#582ea2",
          700: "#42227a",
          800: "#2c1751",
          900: "#160b29",
        },
        //Danger
        danger: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#F93131",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        // Type Text
        greyGradient: {
          100: "#B4B2B7",
          200: "#89868D",
          300: "#3A3541",
        },
        success: {
          100: "#d5f5ff",
          200: "#abebff",
          300: "#81e0ff",
          400: "#57d6ff",
          500: "#2dccff",
          600: "#24a3cc",
          700: "#1b7a99",
          800: "#125266",
          900: "#533fe4",
        },
        blueGradient: {
          100: "#ddd9fa",
          200: "#bab2f4",
          300: "#988cef",
          400: "#7565e9",
          500: "#533fe4",
          600: "#4232b6",
          700: "#322689",
          800: "#21195b",
          900: "#110d2e",
        },
        //Surface
        whiteGradient: {
          100: "#000000",
          200: "#292929",
          300: "#89868D",
          400: "#F4F5F9",
          500: "#FFFFFF",
        },
        //Shades
        primary: {
          100: "#DECCFE",
          200: "#D3BBFE",
          300: "#C9AAFE",
          400: "#BE99FE",
          500: "#B388FE",
          600: "#A877FD",
          700: "#9D66FD",
          800: "#582ea2",
        },
      }
    : {
        // Primary
        indigoGradient: {
          100: "#160b29",
          200: "#2c1751",
          300: "#42227a",
          400: "#582ea2",
          500: "#6e39cb",
          600: "#8b61d5",
          700: "#a888e0",
          800: "#c5b0ea",
          900: "#e2d7f5",
        },
        //Danger
        danger: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#F93131",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        success: {
          100: "#3A36DB",
          200: "#125266",
          300: "#1b7a99",
          400: "#24a3cc",
          500: "#2dccff",
          600: "#57d6ff",
          700: "#81e0ff",
          800: "#e0f8ff",
          900: "#d5f5ff",
        },
        blueGradient: {
          100: "#110d2e",
          200: "#21195b",
          300: "#322689",
          400: "#4232b6",
          500: "#533fe4",
          600: "#7565e9",
          700: "#988cef",
          800: "#bab2f4",
          900: "#ddd9fa",
        },
        // Type Text
        greyGradient: {
          100: "#3A3541",
          200: "#89868D",
          300: "#B4B2B7",
        },
        //Surface
        whiteGradient: {
          100: "#FFFFFF",
          200: "#F4F5F9",
          300: "#E7E7F4",
          400: "#DBDCDE",
          500: "#000000",
        },
        //Shades
        primary: {
          100: "#6e39cb",
          200: "#9D66FD",
          300: "#A877FD",
          400: "#B388FE",
          500: "#BE99FE",
          600: "#C9AAFE",
          700: "#D3BBFE",
          800: "#DECCFE",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              light: colors.primary[700],
              main: colors.indigoGradient[500],
            },
            secondary: {
              main: colors.primary[500],
              dark: colors.primary[700],
            },
            success: {
              light: colors.success[800],
              main: colors.success[500],
            },
            danger: {
              light: colors.danger[600],
              main: colors.danger[500],
            },
            neutral: {
              dark: colors.greyGradient[300],
              main: colors.greyGradient[200],
              light: colors.greyGradient[100],
            },
            background: {
              default: colors.greyGradient[300],
            },
          }
        : {
            primary: {
              light: colors.primary[700],
              main: colors.indigoGradient[500],
            },
            secondary: {
              main: colors.primary[500],
              dark: colors.primary[100],
            },
            success: {
              light: colors.success[800],
              main: colors.success[500],
            },
            danger: {
              light: colors.danger[800],
              main: colors.danger[500],
            },
            neutral: {
              dark: colors.greyGradient[300],
              main: colors.whiteGradient[300],
              light: colors.greyGradient[100],
            },
            background: {
              default: colors.whiteGradient[200],
            },
          }),
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
