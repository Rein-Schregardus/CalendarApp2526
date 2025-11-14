import {ThemeContext} from "@/hooks/ThemeProvider";
import React, { useContext, useLayoutEffect, useState } from "react";
import DropdownButton from "./Dropdown/DropdownButton";
import DropdownItem from "./Dropdown/DropdownItem";

const ThemeButton = () => {
  const themeContext = useContext(ThemeContext);

  return (
    <DropdownButton label={`Theme: ${themeContext.getTheme()}`} className="bg-secondary rounded-md my-0.5 p-0.5">
        <DropdownItem onClick={() => themeContext.changeTheme("light")}>Light</DropdownItem>
        <DropdownItem onClick={() => themeContext.changeTheme("dark")}>Dark</DropdownItem>
        <DropdownItem onClick={() => themeContext.changeTheme("tomato")}>Tomato</DropdownItem>
        <DropdownItem onClick={() => themeContext.changeTheme("baby")}>Baby</DropdownItem>
    </DropdownButton>
  );
};

export default ThemeButton;
//        <button onClick={() => themeContext.toggleTheme()} className="bg-secondary p-1">toggle theme</button>