'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';

type ModalSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'w-[360px]',
  md: 'w-[480px]',
  lg: 'w-[560px]',
};

interface ModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string; // fallback if no header/title is used
}

function ModalRoot({
  isOpen,
  onClose,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className = '',
  children,
  ariaLabel,
}: ModalRootProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed h-full inset-0 z-50 flex items-center justify-center bg-[#00000080] p-3"
      onClick={closeOnOverlay ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className={`bg-white rounded-xl shadow-lg relative ${sizeClasses[size]} max-w-[95vw] p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-[#795CF512] rounded-2xl p-1 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

function Header({ children, className = '' }: SectionProps) {
  return <div className={`mb-4 flex items-center gap-3 ${className}`}>{children}</div>;
}

function Title({ children, className = '' }: SectionProps) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

function Body({ children, className = '' }: SectionProps) {
  return <div className={`text-sm text-gray-700 ${className}`}>{children}</div>;
}

function Footer({ children, className = '' }: SectionProps) {
  return <div className={`mt-6 flex justify-end gap-2 ${className}`}>{children}</div>;
}

export const Modal = Object.assign(ModalRoot, {
  Header,
  Title,
  Body,
  Footer,
});
