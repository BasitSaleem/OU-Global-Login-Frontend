import React, { useEffect, useMemo, useRef } from "react";
import { Button, Loader } from "@/components/ui";
import { Modal } from "./GenericModal";
import { useDeleteOrganizationProgress } from "@/hooks/useProgressTracking";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { ProgressTracker } from "../ui/ProgressTracker";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { toast } from "@/hooks/useToast";

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
            size="sm"
            ariaLabel="Delete Organization Modal"
        >
            {isDeleting && (
                <Loader text="Initializing deletion" />
            )}
            <>
                <Modal.Title className="mb-2 text-heading-2">Delete Organization</Modal.Title>

                <Modal.Body>
                    <p>
                        Are you sure you want to delete <span className="font-semibold">"{organizationData.name}"</span>?
                    </p>
                    {extraDetails && (
                        <p className="mt-2 text-sm text-[var(--color-primary-900)]">{extraDetails}</p>
                    )}

                    <p className="mt-2 text-sm ">
                        This action cannot be undone.
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="text-[#ffff]"
                        isLoading={isDeleting}
                        disabled={isDeleting}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </>
        </Modal>
    );
};
