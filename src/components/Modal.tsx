import React from "react";
import { cn } from "@/lib/utils";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className={cn(
        "bg-main-bg border border-primary p-8 rounded-2xl shadow-custom max-w-lg w-full relative",
        className
      )}>
        {title && (
          <h2 className="text-2xl font-semibold text-primary mb-4">{title}</h2>
        )}
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-icons hover:text-primary transition-colors duration-200 ease-in-out"
          aria-label="Close"
        >
          <IoClose size={24} />
        </button>
        
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 