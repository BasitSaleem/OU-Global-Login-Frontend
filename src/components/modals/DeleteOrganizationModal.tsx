import React, { useEffect, useState, useRef } from "react";
import { Button, Loader, Input } from "@/components/ui";
import { Modal } from "./GenericModal";
import { useDeleteOrganizationProgress } from "@/hooks/useProgressTracking";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { ProgressTracker } from "../ui/ProgressTracker";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { toast } from "@/hooks/useToast";
import { AlertTriangle } from "lucide-react";

interface DeleteOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    organizationData: OgOrganization;
    extraDetails?: string;
    isDeleting?: boolean;
}

export const DeleteOrganizationModal: React.FC<DeleteOrganizationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    organizationData,
    extraDetails,
    isDeleting = false,
}) => {
    const [confirm1, setConfirm1] = useState('');
    const [confirm2, setConfirm2] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');

    const {
        progress,
        isConnected,
        isConnecting,
        disconnect,
        error,
        reconnect
    } = useDeleteOrganizationProgress(
        (isDeleting || !!(organizationData.id)) ? organizationData.id : null,
    );
    const toastShown = useRef(false);

    const isJobStarted = !!progress;
    const isCompleted = progress?.status === 'completed';
    const isFailed = progress?.status === 'failed';

    const expectedText = `delete ${organizationData.name}`;

    const handleConfirm = () => {
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
        onConfirm();
    };

    const isFormValid = confirm1 === expectedText && confirm2 === expectedText;

    const handleClose = () => {
        if (!isDeleting && !isJobStarted) {
            disconnect();
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            toastShown.current = false;
            return;
        }

        if (isCompleted && !toastShown.current) {
            toast.success("Organization deleted", "The organization is deleted successfully");
            toastShown.current = true;
            disconnect();
            onClose();
        } else if (isFailed && !toastShown.current) {
            toast.error("Organization deletion failed", "The organization is not deleted successfully");
            toastShown.current = true;
            disconnect();
            onClose();
        }
    }, [isCompleted, isFailed, disconnect, onClose, isOpen]);

    useScrollLock(isOpen)

    if (isOpen && isJobStarted) {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
                        <ProgressTracker
                            progress={progress}
                            isConnected={isConnected}
                            isConnecting={isConnecting}
                            error={error}
                            onRetry={reconnect}
                            title="Deleting Organization"
                            iconName="OI"
                        />

                        {/* {(isCompleted || isFailed) && (
                        <div className="mt-8 flex justify-center">
                            <Button
                                onClick={handleClose}
                                variant={isCompleted ? "primary" : "secondary"}
                            >
                                {isCompleted ? "Done" : "Close"}
                            </Button>
                        </div>
                    )} */}

                    </div>
                </div>

            </AnimatePresence>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="md"
            ariaLabel="Delete Organization Modal"
        >
            {isDeleting && (
                <Loader text="Initializing deletion" />
            )}
            <>
                <Modal.Header>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red/10">
                        <AlertTriangle className="h-6 w-6 text-red" />
                    </div>
                    <Modal.Title className="text-red">Delete Organization</Modal.Title>
                </Modal.Header>

                <Modal.Body className="space-y-4">
                    <p className="text-body-medium">
                        Are you sure you want to delete <span className="font-semibold">"{organizationData.name}"</span>?
                        This action is <span className="font-bold">permanent</span> and cannot be undone.
                        All organization data will be cleared from our servers.
                    </p>

                    {extraDetails && (
                        <p className="text-sm text-[var(--color-primary-900)]">{extraDetails}</p>
                    )}

                    <div className="bg-bg-secondary p-3 rounded-lg border border-red/20 border-dashed">
                        <p className="text-body-small text-gray-500">
                            To confirm, please type <span className="font-mono font-bold text-red">delete {organizationData.name}</span> in both fields below.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Input
                            label="Confirmation Field 1"
                            placeholder={`delete ${organizationData.name}`}
                            value={confirm1}
                            onChange={(e) => setConfirm1(e.target.value)}
                            error={error1}
                            disabled={isDeleting}
                        />
                        <Input
                            label="Confirmation Field 2"
                            placeholder={`delete ${organizationData.name}`}
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
                        onClick={handleConfirm}
                        className="text-[#ffff]"
                        isLoading={isDeleting}
                        disabled={!isFormValid || isDeleting}
                    >
                        Delete Organization
                    </Button>
                </Modal.Footer>
            </>
        </Modal>
    );
};
