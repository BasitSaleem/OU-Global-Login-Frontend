'use server';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3-client';
import sharp from 'sharp';

export async function uploadImageServer(formData: FormData, Id: string) {
    try {
        const file = formData.get('image') as File;

        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'File must be an image' };
        }

        if (file.size > 5 * 1024 * 1024) {
            return { success: false, error: 'File size must be less than 5MB' };
        }

        const buffer = await file.arrayBuffer();
        const optimizedImage = await sharp(Buffer.from(buffer))
            .resize(800, 800, {
                fit: 'cover',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        const fileKey = `uploads/${Id}.jpg`;
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fileKey,
            Body: optimizedImage,
            ContentType: 'image/jpeg',
            ACL: 'public-read',
        });
        await s3Client.send(command);
        const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        return {
            success: true,
            url: publicUrl,
            message: 'image updated successfully'
        };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to upload image' };
    }
}
export async function getImageWithId(Id: string) {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${Id}.jpg`;
}
export async function deleteImageWithId(id: string) {
    try {
        const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');

        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: `uploads/${id}.jpg`,
        });

        await s3Client.send(command);
        return { success: true, message: 'Profile image deleted' };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Failed to delete image' };
    }
}