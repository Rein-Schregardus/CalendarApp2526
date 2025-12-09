import React from "react";

interface SmallButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
  notifications?: number;
}

const SmallButton = ({ children, selected = false, notifications = 0, className = "", ...props }: SmallButtonProps) => {
  const baseStyles = "rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-colors relative";
  const selectedStyles = selected
    ? "bg-accent text-white"
    : "bg-primary text-text hover:bg-secondary";

  return (
    <button
      type="button"
      className={`${baseStyles} ${selectedStyles} ${className}`}
      {...props}
    >
      {children}

      {notifications !== 0 && (
        <div
          className="absolute -top-[10px] -right-[10px] min-w-[1.5rem] h-5 px-2 flex items-center justify-center bg-accent text-white rounded-full text-xs leading-4"
        >
          {notifications > 99 ? "99+" : notifications}
        </div>
      )}


    </button>
  );
};

export default SmallButton;
