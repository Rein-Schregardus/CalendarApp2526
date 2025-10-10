import React from "react";
import SmallButton from "../SmallButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  leftContent: React.ReactNode;
  rightContent?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  setOpenModal,
  title,
  leftContent,
  rightContent,
  size = "lg",
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto p-4">
      {/* Wrapper shrinks to fit modal */}
      <div
        className={`relative inline-block w-full ${sizeClasses} max-h-[90vh]`}
      >
        {/* White modal box */}
        {/* Close button floating outside top-left (~10px gap) */}
        <SmallButton
          onClick={() => setOpenModal(false)}
          notifications={0}
          className="absolute -top-2.5 -left-10 bg-white shadow-md p-2 text-gray-600 hover:text-gray-800 rounded-full z-50"
        >
          <FontAwesomeIcon icon={faXmark} />
        </SmallButton>

        <div className="bg-white rounded-lg shadow-md flex overflow-hidden max-h-[90vh]">
          {/* Left pane */}
          <div className="flex-1 p-6 overflow-y-auto relative">
            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
            {leftContent}
          </div>

          {/* Right pane */}
          {rightContent && (
            <div className="w-1/3 bg-gray-50 border-l border-gray-200 p-6 flex flex-col gap-4 overflow-y-auto">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
