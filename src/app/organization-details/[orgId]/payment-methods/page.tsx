"use client"
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout";
import PaymentMethodCard from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentMethodCard";
import PaymentModal from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentModal";
import DeletePaymentModal from '@/components/pages/OrganizationDetails/PaymentMethods/DeletePaymentModal';

export interface PaymentMethod {
    id: string;
    cardType: 'visa' | 'mastercard';
    last4: string;
    expiry: string;
    isPrimary: boolean;
    cardHolderName: string;
}

const PaymentMethodsPage = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: '1',
            cardType: 'visa',
            last4: '4343',
            expiry: '12/26',
            isPrimary: true,
            cardHolderName: 'John Doe'
        },
        {
            id: '2',
            cardType: 'mastercard',
            last4: '4343',
            expiry: '12/26',
            isPrimary: false,
            cardHolderName: 'John Doe'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleAddClick = () => {
        setModalMode('add');
        setSelectedMethod(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (method: PaymentMethod) => {
        setModalMode('edit');
        setSelectedMethod(method);
        setIsModalOpen(true);
    };

    const handleDeleteClick = () => {
        // setSelectedMethod(method);
        setIsDeleteModalOpen(true);
    };

    const handleMakePrimary = (id: string) => {
        setPaymentMethods(prev => prev.map(m => ({
            ...m,
            isPrimary: m.id === id
        })));
    };

    const handleSave = (data: any) => {
        if (modalMode === 'add') {
            const newMethod: PaymentMethod = {
                id: Math.random().toString(36).substr(2, 9),
                cardType: 'visa',
                last4: data.cardNumber.slice(-4),
                expiry: data.expiryDate,
                isPrimary: paymentMethods.length === 0,
                cardHolderName: data.cardHolderName
            };
            setPaymentMethods(prev => [...prev, newMethod]);
        } else if (modalMode === 'edit' && selectedMethod) {
            setPaymentMethods(prev => prev.map(m => m.id === selectedMethod.id ? {
                ...m,
                last4: data.cardNumber.slice(-4),
                expiry: data.expiryDate,
                cardHolderName: data.cardHolderName
            } : m));
        }
    };

    return (
        <div className="px-4 py-12 w-full mx-auto md:px-11">
            <div className="flex items-center gap-2 mb-6">
                <h1 className="font-bold text-2xl">Payment Method</h1>
                <div className="bg-[#8B5CF6] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    {paymentMethods.length}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <PaymentMethodCard
                    variant="add"
                    onAdd={handleAddClick}
                />
                {paymentMethods.map(method => (
                    <PaymentMethodCard
                        key={method.id}
                        variant="display"
                        cardType={method.cardType}
                        last4={method.last4}
                        expiry={method.expiry}
                        isPrimary={method.isPrimary}
                        onEdit={() => handleEditClick(method)}
                        onDelete={() => setIsDeleteModalOpen(true)}
                        onMakePrimary={() => handleMakePrimary(method.id)}
                    />
                ))}
            </div>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                initialData={selectedMethod}
                onSave={handleSave}
            />
            <DeletePaymentModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDeleteClick}
            // initialData={selectedMethod}
            />


        </div>
    );
};

export default PaymentMethodsPage;