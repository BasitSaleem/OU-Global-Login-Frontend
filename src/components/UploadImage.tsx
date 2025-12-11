'use client';
import { useState, useRef } from 'react';
import { LoadingSpinner } from './ui';
import { uploadImageServer } from '@/actions/upload.actions';

interface ImageUploadProps {
    onUploadComplete: (imageUrl: string) => void;
    maxSize?: number;
    acceptedFiles?: string;
    id: string
}

export default function ImageUpload({
    onUploadComplete,
    maxSize = 5,
    acceptedFiles = 'image/*',
    id
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleServerUpload = async (file: File) => {
        try {
            setIsUploading(true);
            setError('');

            const formData = new FormData();
            formData.append('image', file);
            const result = await uploadImageServer(formData, id);
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
        <div className="space-y-2">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border border-dashed  rounded-lg py-3 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedFiles}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                />
                {isUploading ? (
                    <LoadingSpinner size={4} />
                ) : (
                    <div>
                        <div className="flex text-sm justify-center">
                            <span className="relative rounded-md font-medium hover:text-primary">
                                Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs  mt-1">
                            PNG, JPG, GIF up to {maxSize}MB
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="text-red-600 text-xs bg-background p-2 text-center border rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
}