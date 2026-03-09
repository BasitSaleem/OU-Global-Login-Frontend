"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { ROUTES } from '@/constants';
import { Button, } from '@/components/ui';
import { useDeclineChangeEmail } from '@/apiHooks.ts/auth/auth.api';

const Page = () => {
    const router = useRouter();
    const { mutate: declineChangeEmail, isPending, status: mutationStatus, error } = useDeclineChangeEmail();
    const searchParams = useSearchParams();
    const token = searchParams.get("change_email_token") || "";

    const handleDecline = () => {
        declineChangeEmail({ token });
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] px-6 z-50 relative">
                <div className="text-center space-y-4 bg-bg-secondary p-8 rounded-3xl border border-red-100 shadow-sm max-w-sm w-full">
                    <p className="text-red-500 font-bold text-lg">Invalid Session</p>
                    <p className="text-text-secondary text-sm">Please restart the email change process from your settings.</p>
                    <Button onClick={() => router.push(ROUTES.DASHBOARD)} variant="primary" className="w-full rounded-2xl py-2">
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div className="flex items-center justify-center min-h-[50vh] px-6 z-50 relative">
            <div className="text-center space-y-6 bg-bg-secondary p-8 rounded-3xl border border-border-primary max-w-sm w-full">
                {(mutationStatus === 'idle' || isPending) && (
                    <>
                        <h2 className="text-xl font-bold text-text">Decline Email Change</h2>
                        <p className="text-sm text-text-secondary">Are you sure you want to decline the requested email change? Your current email will remain unchanged.</p>
                        <Button
                            onClick={handleDecline}
                            isLoading={isPending}
                            className="w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white cursor-pointer py-2"
                        >
                            Confirm Decline
                        </Button>
                        <Button
                            onClick={() => router.push(ROUTES.DASHBOARD)}
                            disabled={isPending}
                            className="w-full rounded-2xl bg-bg-secondary border border-border-primary text-text hover:bg-bg-hover py-2"
                        >
                            Cancel & Go to Login
                        </Button>
                    </>
                )}


                {mutationStatus === 'success' && (
                    <>
                        <div className="text-green-500 text-5xl flex justify-center">✓</div>
                        <p className="text-lg font-bold text-green-600">Successfully Declined</p>
                        <Button onClick={() => router.push(ROUTES.LOGIN)} variant="primary" className="w-full rounded-2xl py-2">
                            Back to Login
                        </Button>                    </>
                )}

                {mutationStatus === 'error' && (
                    <>
                        <div className="text-red-500 text-5xl flex justify-center">✕</div>
                        <p className="text-lg font-bold text-red-600">Decline Failed</p>
                        <p className="text-sm text-center">
                            {error?.message?.includes("No change email request found")
                                ? "This decline link is invalid or has already been used. Redirecting to login..."
                                : "We couldn't process your request. Please try again or contact support."}
                        </p>
                        <Button onClick={() => router.push(ROUTES.LOGIN)} variant="primary" className="w-full rounded-2xl py-2">
                            Back to Login
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Page