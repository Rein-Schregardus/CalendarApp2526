import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "@/context/NotificationsContext";

interface NotificationsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
  notifications?: number;
}

const NotificationsButton = ({ children, className = "", ...props } : NotificationsButtonProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();

  // Close menu when clicking outside
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`rounded-full w-9 h-9 flex items-center justify-center bg-white hover:bg-secondary relative cursor-pointer ${className}`}
        {...props}
      >
        <FontAwesomeIcon icon={faInbox} />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 min-w-[1.5rem] h-5 px-2 flex items-center justify-center bg-accent text-white text-xs rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 mt-4 bg-white rounded-md shadow-lg transition-all duration-300 origin-top z-50 
          ${open ? "opacity-100 scale-100 visible" : "opacity-0 scale-75 invisible"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default NotificationsButton;


