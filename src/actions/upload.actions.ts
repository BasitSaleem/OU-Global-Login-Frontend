'use server';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3-client';
import sharp from 'sharp';

export async function uploadImageServer(formData: FormData, Id: string) {
    try {
        const file = formData.get('image') as File;

        if (!process.env.OG_AWS_S3_BUCKET_NAME || !process.env.OG_AWS_REGION) {
            console.error('Missing AWS configuration');
            return { success: false, error: 'Server configuration error' };
        }

        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'File must be an image' };
        }

        if (file.size > 2 * 1024 * 1024) {
            return { success: false, error: 'File size must be less than 2MB' };
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
            Bucket: process.env.OG_AWS_S3_BUCKET_NAME!,
            Key: fileKey,
            Body: optimizedImage,
            ContentType: 'image/jpeg',
            ACL: 'public-read',
        });
        await s3Client.send(command);
        const publicUrl = `https://${process.env.OG_AWS_S3_BUCKET_NAME}.s3.${process.env.OG_AWS_REGION}.amazonaws.com/${fileKey}`;

        return {
            success: true,
            url: publicUrl,
            message: 'image updated successfully'
        };
    } catch (error: any) {
        console.error('Upload error:', error);
        return { success: false, error: `Failed to upload image: ${error.message || 'Unknown error'}` };
    }
}
export async function getImageWithId(Id: string) {
    return `https://${process.env.OG_AWS_S3_BUCKET_NAME}.s3.${process.env.OG_AWS_REGION}.amazonaws.com/uploads/${Id}.jpg`;
}
export async function deleteImageWithId(id: string) {
    try {
        const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');

        const command = new DeleteObjectCommand({
            Bucket: process.env.OG_AWS_S3_BUCKET_NAME!,
            Key: `uploads/${id}.jpg`,
        });

        if (!process.env.OG_AWS_S3_BUCKET_NAME) {
            throw new Error('Bucket name is not defined');
        }

        await s3Client.send(command);
        return { success: true, message: 'Profile image deleted' };
    } catch (error: any) {
        console.error('Delete error:', error);
        return { success: false, error: `Failed to delete image: ${error.message || 'Unknown error'}` };
    }
}