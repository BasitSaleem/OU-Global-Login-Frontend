import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/modals/GenericModal';
import { PaymentMethod } from '@/app/organization-details/[orgId]/payment-methods/page';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onDelete,
}) => {



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onDelete();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} >


            <Modal.Title>
                Delete Payment Method
            </Modal.Title>

            <Modal.Header>
                Are you sure you want to delete this payment method?
            </Modal.Header>

            <Modal.Footer>
                <Button
                    variant='secondary'
                    type="button"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant='destructive'
                    onClick={handleSubmit}
                >
                    Delete
                </Button>
            </Modal.Footer>

        </Modal>
    );
};

export default PaymentModal;
