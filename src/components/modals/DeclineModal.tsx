'use client';

import React from 'react';
import { Modal } from './GenericModal';

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeclineModal({ isOpen, onClose, onConfirm }: DeclineModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" ariaLabel="Decline invitation">
      <Modal.Body className="mt-4 mb-4">
        <p className="text-start text-gray-800">
          Are you sure you want to decline this invitation?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg border border-[#795CF5] text-[#795CF5] hover:bg-[#795CF512] cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-8 py-2 rounded-lg text-white cursor-pointer"
          style={{ backgroundColor: '#795CF5' }}
        >
          Yes
        </button>
      </Modal.Footer>
    </Modal>
  );
}
