import React from "react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  confirmColor = "bg-red-500 hover:bg-red-600",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md sm:w-96 p-6 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">
          {title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6 text-center">
          {message}
        </p>

        {/* Buttons - centered */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium transition ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
