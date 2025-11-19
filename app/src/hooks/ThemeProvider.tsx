import React, { createContext, useLayoutEffect, useState } from "react";

const APPLICATION_NAME = "color-theme-toggle";

type TThemeContext = {
  changeTheme: (newTheme: "light" | "dark" | "tomato" | "baby") => void
  getTheme: () => string
}

const ThemeContext = createContext<TThemeContext>({
  changeTheme(newTheme: "light" | "dark" | "tomato" | "baby") {throw new Error("theme context not available");},
  getTheme() {throw new Error("theme context not available");
  },});



const ThemeProvider = ({ children }: { children?: React.ReactElement }) => {

  let initialTheme = localStorage.getItem(APPLICATION_NAME);
  if (initialTheme === null)
    {if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
      initialTheme = "dark";
    }
    else{
      initialTheme = "light";
    }
  }
  const [theme, setTheme] = useState(initialTheme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", (theme));
  }, [theme]);

  const changeTheme = (newTheme: "light" | "dark" | "tomato" | "baby") => {
    setTheme(newTheme);
    localStorage.setItem(APPLICATION_NAME, newTheme);
  };

  const getTheme = () => {
    return theme;
  }

  return (
    <ThemeContext.Provider value={{changeTheme, getTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export {ThemeProvider, ThemeContext};