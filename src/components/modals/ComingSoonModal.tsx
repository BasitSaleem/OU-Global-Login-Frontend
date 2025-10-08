'use client';

import React from 'react';
import { Modal } from './GenericModal';

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
  title = 'Coming Soon!',
  description,
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" ariaLabel="Coming soon">
      <Modal.Header className="justify-center ">
        <div className="mb-2 mt-2 rounded-full p-[2px]  bg-gradient-to-b from-white to-purple-950">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(120,71,142,0.6)]">
            {icon}
          </div>
        </div>
      </Modal.Header>

      <Modal.Title className="text-center">{title}</Modal.Title>

      {description && (
        <Modal.Body className="text-center text-gray-500 mt-2">
          {description}
        </Modal.Body>
      )}
    </Modal>
  );
}
