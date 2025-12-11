'use client';

import React from 'react';
import { Modal } from './GenericModal';
import { Button } from '../ui';

interface InviteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (token: string) => void;
  token: string;
  isPending: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'destructive';
}

export default function InviteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  token,
  isPending,
  title = "Are you sure?",
  description,
  confirmText = "Yes",
  confirmVariant = "destructive"
}: InviteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" ariaLabel={title}>
      <Modal.Title className="mt-4 mb-4">
        {title}
      </Modal.Title>

      {description && (
        <p className="text-body-medium text-gray-600 mb-4">
          {description}
        </p>
      )}

      <Modal.Footer>
        <div className='flex gap-2'>
          <Button
            variant='secondary'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => onConfirm(token)}
            isLoading={isPending}
          >
            {confirmText}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
