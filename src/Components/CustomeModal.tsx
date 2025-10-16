import React from 'react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomeModal: React.FC<CustomModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // don't render anything if modal is closed

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose} // close on overlay click
      ></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-[rgba(39,39,42,1)] rounded-xl shadow-lg max-w-lg w-full mx-4 p-6 relative"
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
        >
          {children}
          {/* Close button (optional) */}
          <button
            className="absolute top-3 right-3 text-white text-lg font-bold"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomeModal;
