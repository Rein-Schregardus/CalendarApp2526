import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

interface NotificationsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
  notifications?: number;
}

const NotificationsButton = ({
  children,
  selected = false,
  notifications = 0,
  className = "",
  ...props
}: NotificationsButtonProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menu when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseStyles =
    "rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-colors relative bg-white text-black hover:bg-secondary";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${baseStyles} ${className}`}
        {...props}
      >
        <FontAwesomeIcon icon={faInbox} />

        {notifications !== 0 && (
          <div className="absolute -top-[10px] -right-[10px] min-w-[1.5rem] h-5 px-2 flex items-center justify-center bg-accent text-white rounded-full text-xs leading-4">
            {notifications > 99 ? "99+" : notifications}
          </div>
        )}
      </button>

      {/* Dropdown */}
      <div className={`absolute left-1/2 -translate-x-1/2 mt-4 bg-white rounded-md shadow-lg transition-all duration-300 origin-top z-50 
        ${open ? "opacity-100 scale-100 visible" : "opacity-0 scale-75 invisible"}`}>

        {children}
        <div className="absolute bg-primary w-8 h-8 rotate-45 rounded-md left-1/2 -translate-x-1/2 -top-2 -z-25"></div>

      </div>

    </div>
  );
};

export default NotificationsButton;
