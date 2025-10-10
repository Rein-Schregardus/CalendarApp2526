import React from "react";
import SmallButton from "../SmallButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ setOpenModal, title, size = "md", children }) => {
  // Tailwind width presets
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`relative bg-white rounded-lg shadow-md w-full ${sizeClasses}`}>
        {/* Close button - top right */}
        <SmallButton
          onClick={() => setOpenModal(false)}
          notifications={0} // ensure no badge
        >
          <FontAwesomeIcon icon={faXmark} />
        </SmallButton>

        {/* Inner content */}
        <div className="p-6">
          {title && (
            <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
          )}

          <div className="overflow-y-auto max-h-[75vh]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
