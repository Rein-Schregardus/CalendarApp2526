import React from "react";

interface SmallButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
  notifications?: number;
}

const SmallButton = ({ children, selected = false, className = "", ...props }: SmallButtonProps) => {
  const baseStyles = "rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-colors relative";
  const selectedStyles = selected
    ? "bg-accent text-white"
    : "bg-white text-black hover:bg-secondary";

  return (
    <button
      type="button"
      className={`${baseStyles} ${selectedStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SmallButton;