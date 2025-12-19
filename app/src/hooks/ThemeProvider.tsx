import React, {
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { ThemeContext, type ThemeName } from "../context/ThemeContext";

const APPLICATION_NAME = "color-theme-toggle";
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getInitialTheme = (): ThemeName => {
    const stored = localStorage.getItem(APPLICATION_NAME) as ThemeName | null;
    if (stored) return stored;

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  };

  const [theme, setTheme] = useState<ThemeName>(getInitialTheme());

  // Apply the theme to <html> whenever it changes
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const changeTheme = (newTheme: ThemeName) => {
    setTheme(newTheme);
    localStorage.setItem(APPLICATION_NAME, newTheme);
  };

  const getTheme = () => theme;

  return (
    <ThemeContext.Provider value={{ changeTheme, getTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
