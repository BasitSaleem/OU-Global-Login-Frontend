'use client';

import { X } from "lucide-react";
import React from "react";

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeclineModal({ isOpen, onClose, onConfirm }: DeclineModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] p-2"
      onClick={onClose} // close on overlay click
    >
      <div
        className="bg-white rounded-lg shadow-lg relative w-[400px] p-4 "
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600  bg-[#795CF512] rounded-xl cursor-pointer p-1"
        >
          <X className="w-4 h-4"  />
        </button>

        {/* Message */}
        <p className="text-start text-gray-800 mb-6 mt-5">
          Are you sure you want to decline this invitation?
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-[#795CF5] text-[#795CF5] hover:bg-[#795CF512] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2 rounded-lg text-white cursor-pointer"
            style={{ backgroundColor: "#795CF5" }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
