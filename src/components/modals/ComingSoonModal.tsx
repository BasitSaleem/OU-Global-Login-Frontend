'use client';

import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export default function ComingSoonModal({ 
  isOpen, 
  onClose, 
  icon, 
  title = "Coming Soon!", 
  description 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] p-5"
      onClick={onClose} // ✅ close when clicking the overlay
    >
      <div
        className="bg-white rounded-lg shadow-lg relative p-6 w-[400px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-[#795CF512] rounded-2xl p-1" 
        >
          <X className="w-5 h-5 " />
        </button>

        {/* Icon */}
        <div className="mb-5 mt-4 rounded-full p-[2px] bg-gradient-to-b from-purple-100 to-purple-600">
         <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(120,71,142,0.6)] ">
  {icon}
</div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* Optional Description */}
        {description && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
