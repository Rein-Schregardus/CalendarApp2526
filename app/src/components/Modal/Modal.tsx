import React from "react";
import SmallButton from "../SmallButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  setOpenModal,
  title,
  leftContent,
  rightContent,
  size = "lg",
  children,
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto p-4">
      {/* Modal wrapper */}
      <div
        className={`relative inline-block w-full ${sizeClasses} max-h-[90vh]`}
      >
        <div className="bg-white rounded-lg shadow-md flex overflow-hidden max-h-[90vh]">
          {/* Left pane */}
          <div className="flex-1 p-6 overflow-y-auto relative">
            {/* Close button */}
            <div className="absolute top-3 right-3 z-50">
              <SmallButton onClick={() => setOpenModal(false)} notifications={0}>
                <FontAwesomeIcon icon={faXmark} />
              </SmallButton>
            </div>

            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

            {/* If children are provided, render them instead of leftContent */}
            {children ?? leftContent}
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
