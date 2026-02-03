'use client';

import React, { useState } from 'react';
import { Modal } from './GenericModal';
import { Button, Input } from '../ui';
import { useDeleteAccount, useLogout } from '@/apiHooks.ts/auth/auth.api';
import { useGetOrganizations } from '@/apiHooks.ts/organization/organization.api';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/redux/store';

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
    const [error1, setError1] = useState('');
    const { user } = useAppSelector((state) => state.auth);

    const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
    const { mutate: logout } = useLogout();
    const { data: userOrgs } = useGetOrganizations(1, 100);
    const router = useRouter();

    const expectedText = `delete ${userEmail}`;

    const ownedOrgsCount = userOrgs?.organization.filter(org =>
        org.ogUserId === user?.id ||
        org.memberships?.some(m => m.user_id === user?.id && m.role === 'OWNER')
    ).length || 0;

    const handleDelete = () => {
        if (confirm1 !== expectedText) {
            setError1('Input doesn\'t match');
            return;
        }
        setError1('');

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

    const isFormValid = confirm1 === expectedText;

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
                        To confirm, please type <span className="font-mono font-bold text-red">delete {userEmail}</span> in the field below.
                    </p>
                </div>

                {ownedOrgsCount > 0 && (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Home className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-body-medium-bold text-primary">Owned Organizations</p>
                                <p className="text-body-small text-gray-500">You are the owner of {ownedOrgsCount} organization{ownedOrgsCount > 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <Link
                            href="/organizations?filter=owned"
                            className="text-body-small font-bold text-primary hover:underline"
                            onClick={onClose}
                        >
                            View All
                        </Link>
                    </div>
                )}

                <div className="space-y-3">
                    <Input
                        label="Confirmation Field"
                        placeholder={`delete ${userEmail}`}
                        value={confirm1}
                        onChange={(e) => setConfirm1(e.target.value)}
                        error={error1}
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
