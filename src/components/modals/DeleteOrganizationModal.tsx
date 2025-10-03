"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Modal } from "./GenericModal";
import { LoadingSpinner } from "../ui";

interface DeleteOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    organizationName: string;
    extraDetails?: string;
    isDeleting?: boolean;
}

export const DeleteOrganizationModal: React.FC<DeleteOrganizationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    organizationName,
    extraDetails,
    isDeleting = false,
}) => {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={isDeleting ? () => { } : onClose}
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
                            {isDeleting ? "Deleting..." : "Are you sure you want to delete "} <span className="font-semibold">"{organizationName}"</span>
                        </p>
                        {!isDeleting && extraDetails && (
                            <p className="mt-2 text-gray-500 text-sm">{extraDetails}</p>
                        )}
                        {
                            !isDeleting && (
                                <p className="mt-2 text-sm text-gray-500">
                                    This action cannot be undone.
                                </p>
                            )
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isDeleting}
                            className={`bg-gray-100 text-gray-700 hover:bg-gray-200 ${isDeleting && "cursor-not-allowed"}`}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className={`bg-red-600 text-white hover:bg-red-700 ${isDeleting && "cursor-not-allowed"}`}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </Modal.Footer>
                </>
            </Modal>
        </>
    );
};
