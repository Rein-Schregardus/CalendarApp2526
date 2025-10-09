import React from "react";

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  closeDropdown?: () => void; // 👈 this is new
}

const DropdownItem: React.FC<DropdownItemProps> = ({children, className = "", closeDropdown, onClick, ...props}) => {
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    closeDropdown?.();
  };

  return (
    <button
      type="button"
      {...props}
      onClick={handleClick}
      className={`text-left px-4 py-2 cursor-pointer hover:bg-[#e0e2e6] whitespace-nowrap ${className}`}
    >
      {children}
    </button>
  );
};

export default DropdownItem;
