import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/modals/GenericModal';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: any;
    onSave: (data: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    mode,
    initialData,
    onSave
}) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        billingAddress: ''
    });

    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                cardNumber: initialData.cardNumber || '',
                expiryDate: initialData.expiry || '',
                cvv: '***',
                billingAddress: initialData.cardHolderName || ''
            });
        } else {
            setFormData({
                cardNumber: '',
                expiryDate: '',
                cvv: '',
                billingAddress: ''
            });
        }
    }, [initialData, mode, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <Modal.Title>
                {mode === 'add' ? 'Add New Card' : 'Edit Card'}
            </Modal.Title>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="py-4 space-y-4">
                    <Input
                        label="Card Number"
                        name="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        isRequired
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Expiry Date"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            isRequired
                        />
                        <Input
                            label="CVV/CVC"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                            isRequired
                        />
                    </div>
                    <Input
                        label="Billing Address"
                        name="billingAddress"
                        placeholder="Enter Billing Address"
                        value={formData.billingAddress}
                        onChange={handleChange}
                        isRequired
                    />

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant='secondary'
                    type="button"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant='primary'
                    type="submit"
                >
                    {mode === 'add' ? 'Add Card' : 'Save Changes'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentModal;
