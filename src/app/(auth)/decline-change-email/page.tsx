import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui';
import { useDeclineChangeEmail } from '@/apiHooks.ts/auth/auth.api';

const Page = () => {
    const router = useRouter();
    const { mutate: declineChangeEmail, isPending } = useDeclineChangeEmail();
    const searchParams = useSearchParams();
    const token = searchParams.get("change_email_token") || "";
    const hasCalledDecline = useRef(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (token && !hasCalledDecline.current) {
            hasCalledDecline.current = true;
            declineChangeEmail(
                { token },
                {
                    onSuccess: () => {
                        setStatus('success');
                        setTimeout(() => {
                            router.push(ROUTES.LOGIN);
                        }, 3000);
                    },
                    onError: () => {
                        setStatus('error');
                    }
                }
            );
        }
    }, [token, declineChangeEmail, router]);

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] px-6">
                <div className="text-center space-y-4 bg-bg-secondary p-8 rounded-3xl border border-red-100 shadow-sm max-w-sm w-full">
                    <p className="text-red-500 font-bold text-lg">Invalid Session</p>
                    <p className="text-text-secondary text-sm">Please restart the email change process from your settings.</p>
                    <Button onClick={() => router.push(ROUTES.LOGIN)} variant="primary" className="w-full rounded-2xl">
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[50vh] px-6">
            <div className="text-center space-y-6 bg-bg-secondary p-8 rounded-3xl border border-border-primary shadow-sm max-w-sm w-full">
                {isPending && (
                    <>
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                        <p className="text-lg font-medium">Declining Email Change...</p>
                        <p className="text-text-secondary text-sm text-center">Please wait while we process your request.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-green-500 text-5xl flex justify-center">✓</div>
                        <p className="text-lg font-bold text-green-600">Successfully Declined</p>
                        <p className="text-text-secondary text-sm">The email change request has been cancelled. Redirecting to login...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-5xl flex justify-center">✕</div>
                        <p className="text-lg font-bold text-red-600">Decline Failed</p>
                        <p className="text-text-secondary text-sm text-center">We couldn't decline the request. It may have already been processed or the link is invalid.</p>
                        <Button onClick={() => router.push(ROUTES.LOGIN)} variant="primary" className="w-full rounded-2xl">
                            Back to Login
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Page