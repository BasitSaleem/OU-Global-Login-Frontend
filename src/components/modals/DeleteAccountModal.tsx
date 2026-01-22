'use client';

import React, { useState } from 'react';
import { Modal } from './GenericModal';
import { Button, Input } from '../ui';
import { useDeleteAccount, useLogout } from '@/apiHooks.ts/auth/auth.api';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

export const DeleteAccountModal = ({
    isOpen,
    onClose,
    userEmail,
}: DeleteAccountModalProps) => {
    const [confirm1, setConfirm1] = useState('');
    const [confirm2, setConfirm2] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');

    const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
    const { mutate: logout } = useLogout();
    const router = useRouter();

    const expectedText = `delete ${userEmail}`;

    const handleDelete = () => {
        let hasError = false;
        if (confirm1 !== expectedText) {
            setError1('Input doesn\'t match');
            hasError = true;
        } else {
            setError1('');
        }

        if (confirm2 !== expectedText) {
            setError2('Input doesn\'t match');
            hasError = true;
        } else {
            setError2('');
        }

        if (hasError) return;

        deleteAccount(undefined, {
            onSuccess: () => {
                logout(undefined, {
                    onSuccess: () => {
                        router.push('/login');
                    }
                });
            }
        });
    };

    const isFormValid = confirm1 === expectedText && confirm2 === expectedText;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <Modal.Header>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red/10">
                    <AlertTriangle className="h-6 w-6 text-red" />
                </div>
                <Modal.Title className="text-red">Delete Account</Modal.Title>
            </Modal.Header>

            <Modal.Body className="space-y-4">
                <p className="text-body-medium">
                    This action is <span className="font-bold">permanent</span> and cannot be undone.
                    All your data will be cleared from our servers.
                </p>

                <div className="bg-bg-secondary p-3 rounded-lg border border-red/20 border-dashed">
                    <p className="text-body-small text-gray-500">
                        To confirm, please type <span className="font-mono font-bold text-red">delete {userEmail}</span> in both fields below.
                    </p>
                </div>

                <div className="space-y-3">
                    <Input
                        label="Confirmation Field 1"
                        placeholder={`delete ${userEmail}`}
                        value={confirm1}
                        onChange={(e) => setConfirm1(e.target.value)}
                        error={error1}
                        disabled={isDeleting}
                    />
                    <Input
                        label="Confirmation Field 2"
                        placeholder={`delete ${userEmail}`}
                        value={confirm2}
                        onChange={(e) => setConfirm2(e.target.value)}
                        error={error2}
                        disabled={isDeleting}
                    />
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    disabled={!isFormValid || isDeleting}
                >
                    Delete Account
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
