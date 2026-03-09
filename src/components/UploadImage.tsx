import { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { useRemoveProfileImage } from '@/apiHooks.ts/auth/auth.api';
import { request } from '@/utils/requestFunction';
import { Modal } from './modals/GenericModal';
import { Button, LoadingSpinner } from './ui';


interface ImageUploadProps {
    onUploadComplete: (imageUrl: string) => void;
    onDelete?: () => void;
    imageUrl?: string | null;
    maxSize?: number;
    acceptedFiles?: string;
    id: string
}

export default function ImageUpload({
    onUploadComplete,
    onDelete,
    imageUrl,
    maxSize = 5,
    acceptedFiles = 'image/*',
    id
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: removeImage, isPending: isRemoving } = useRemoveProfileImage();

    const handleServerUpload = async (file: File) => {
        try {
            setIsUploading(true);
            setError('');

            const formData = new FormData();
            formData.append('image', file);
            const response = await request("/profile/upload-image", "POST", {}, formData, true)
            const result = response.data
            if (!result.success) {
                throw new Error(result.error);
            }
            onUploadComplete(result.url!);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);

        }
    };

    const handleDelete = async () => {
        removeImage(undefined, {
            onSuccess: () => {
                setIsConfirmModalOpen(false);
                if (onDelete) onDelete();
            }
        });
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > maxSize * 1024 * 1024) {
            setError(`File size must be less than ${maxSize}MB`);
            return;
        }

        await handleServerUpload(file);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            handleFileSelect({ target: { files: [file] } } as any);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div className="space-y-4">
            <div className="relative group mx-auto w-24 h-24">
                {imageUrl ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                        <img
                            src={imageUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => setIsConfirmModalOpen(true)}
                        >
                            <Trash2 className="text-white w-6 h-6" />
                        </div>
                    </div>
                ) : (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="w-24 h-24 border border-dashed rounded-full flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer text-center p-2"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isUploading ? (
                            <LoadingSpinner size={4} />
                        ) : (
                            <>
                                <span className="text-[10px] font-medium leading-tight">Upload photo</span>
                            </>
                        )}
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedFiles}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading || isRemoving}
                />
            </div>

            {!imageUrl && (
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        PNG, JPG up to {maxSize}MB
                    </p>
                </div>
            )}

            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} size="sm">
                <Modal.Header>
                    <Modal.Title>Remove Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to remove your profile photo?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="ghost"
                        onClick={() => setIsConfirmModalOpen(false)}
                        disabled={isRemoving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        isLoading={isRemoving}
                    >
                        Yes, Remove
                    </Button>
                </Modal.Footer>
            </Modal>

            {error && (
                <div className="text-red-600 text-xs bg-background p-2 text-center border rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
}