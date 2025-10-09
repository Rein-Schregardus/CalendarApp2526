import React, { useState, useRef, useEffect} from "react";
import type {ReactNode, ReactElement } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface DropdownButtonProps {
  label: string;
  icon?: any;
  className?: string;
  children?: ReactNode;
}

interface DropdownItemWithClose extends ReactElement {
  props: {
    closeDropdown?: () => void;
    [key: string]: any;
  };
}

const DropdownButton = ({ label, icon, className, children }: DropdownButtonProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as DropdownItemWithClose, {
        closeDropdown: () => setOpen(false),
      });
    }
    return child;
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className={className}
      >
        {icon && <FontAwesomeIcon icon={icon} />}
        <span>{label}</span>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={`transition-transform duration-800 ${open ? "rotate-540" : "rotate-0"}`}
        />
      </button>

      <div
        className={`absolute flex flex-col gap-2 left-0 mt-1 py-2 min-w-max bg-white rounded-lg shadow-lg 
        transition-all duration-300 origin-top z-100
        ${open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
      >
        {childrenWithProps}
      </div>
    </div>
  );
};

export default DropdownButton;
