import { createContext } from "react";
export type ThemeName = "light" | "dark" | "tomato" | "baby";
export type ThemeContextType = {
  changeTheme: (newTheme: ThemeName) => void;
  getTheme: () => ThemeName;
};

export const ThemeContext = createContext<ThemeContextType>({
  changeTheme: () => {
    throw new Error("ThemeContext not available");
  },
  getTheme: () => {
    throw new Error("ThemeContext not available");
  },
});