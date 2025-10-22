"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Modal } from "./GenericModal";
import { motion } from "framer-motion";
import { useDeleteOrganizationProgress } from "@/hooks/useProgressTracking";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { JobProgress } from "@/types/progressTypes";
import { LoadingSpinner } from "../ui";

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
        isDeleting ? organizationData.id || null : null,
    );

    const handleClose = () => {
        if (!isDeleting) {
            disconnect();
            onClose();
        }
    };

    // Show progress bar only when deleting
    if (isDeleting) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={() => { }} // Prevent closing during deletion
                size="md"
                ariaLabel="Delete Organization Progress"
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Trash2 className="w-6 h-6 text-red-600" />
                        <h2 className="text-xl font-semibold">
                            Deleting Organization
                        </h2>
                    </div>

                    <div className="text-center mb-6">
                        <p className=" mb-2">
                            Deleting <span className="font-semibold">"{organizationData.name}"</span>
                        </p>
                        <p className="text-sm ">
                            Please wait while we process the deletion...
                        </p>
                    </div>

                    {ProgressTracking(progress, onClose, reconnect, error, isConnecting, isConnected)}
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="sm"
            ariaLabel="Delete Organization Modal"
        >
            <>
                <Modal.Header>
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <Modal.Title>Delete Organization</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to delete <span className="font-semibold">"{organizationData.name}"</span>?
                    </p>
                    {extraDetails && (
                        <p className="mt-2 text-sm">{extraDetails}</p>
                    )}
                    <p className="mt-2 text-sm ">
                        This action cannot be undone.
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="text-[#ffff]"
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </>
        </Modal>
    );
};
function ProgressTracking(progress: JobProgress | null, onClose: () => void, reconnect: () => void, error: string | null, isConnecting: boolean, isConnected: boolean) {
    return <div className="space-y-4">
        {progress ? (
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                        {progress.status === 'completed' ? 'Deletion Complete!' :
                            progress.status === 'failed' ? 'Deletion Failed' :
                                progress.status === 'queued' ? 'Queued for Deletion' :
                                    'Deleting Organization...'}
                    </span>
                    <span className="text-sm ">
                        {progress.progress}%
                    </span>
                </div>
                <div className="w-full rounded-full h-2">
                    <motion.div
                        className={`h-2 rounded-full ${progress.status === 'completed' ? 'bg-[#795CF5]' :
                            progress.status === 'failed' ? 'bg-red-500' :
                                'bg-red-600'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }} />
                </div>
                {progress.status === 'completed' && (
                    <div className="mt-4 text-center">
                        <Button
                            onClick={onClose}
                            className="bg-[#795CF5] hover:bg-[#9c88f5]"
                        >
                            Done
                        </Button>
                    </div>
                )}
                {progress.status === 'failed' && (
                    <div className="mt-4 text-center space-x-2">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={reconnect}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Retry
                        </Button>
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                        Initializing deletion...
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: '10%' }} />
                </div>
            </div>
        )}

        {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                    <strong>Error:</strong> {error}
                </p>
            </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs ">
            {isConnecting ? (
                <>
                    <LoadingSpinner size={3} />
                    <span>Connecting...</span>
                </>
            ) : isConnected ? (
                <>
                    <div className="w-2 h-2 bg-[#2e1792] rounded-full animate-pulse" />
                    <span>Connected</span>
                </>
            ) : (
                <>
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Disconnected</span>

                </>
            )}
        </div>
    </div>;
}

