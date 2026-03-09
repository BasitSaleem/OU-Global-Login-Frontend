import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3-client';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('image') as File;
        const id = formData.get('id') as string;

        if (!process.env.OG_AWS_S3_BUCKET_NAME || !process.env.OG_AWS_REGION) {
            console.error('Missing AWS configuration');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'No ID provided' },
                { status: 400 }
            );
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { success: false, error: 'File must be an image' },
                { status: 400 }
            );
        }

        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: 'File size must be less than 2MB' },
                { status: 400 }
            );
        }

        const buffer = await file.arrayBuffer();
        const optimizedImage = await sharp(Buffer.from(buffer))
            .resize(800, 800, {
                fit: 'cover',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        const fileKey = `uploads/${id}.jpg`;
        const command = new PutObjectCommand({
            Bucket: process.env.OG_AWS_S3_BUCKET_NAME!,
            Key: fileKey,
            Body: optimizedImage,
            ContentType: 'image/jpeg',
            ACL: 'public-read',
        });
        await s3Client.send(command);
        const publicUrl = `https://${process.env.OG_AWS_S3_BUCKET_NAME}.s3.${process.env.OG_AWS_REGION}.amazonaws.com/${fileKey}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            message: 'image updated successfully'
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to upload image: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
