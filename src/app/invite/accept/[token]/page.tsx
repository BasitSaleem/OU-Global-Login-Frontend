'use client';

import { useGetInvitationByToken, useAcceptInvitation } from '@/apiHooks.ts/invitation/invitation.api';
import { Button, LoadingSpinner } from '@/components/ui';
import { getColorFromId } from '@/utils/getRandomColors';
import { Check, Loader2, Mail, Building2, User, AlertCircle } from 'lucide-react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';

export default function AcceptInvitePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = params.token as string;
    const emailParam = searchParams.get('email');

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: invitation, isLoading, error } = useGetInvitationByToken(token, !!token);
    const { mutate: acceptInvitation, isPending: isAccepting } = useAcceptInvitation({
        onSuccess: () => {
            router.push('/organizations');
        }
    });

    // For new users, redirect to signup with email pre-filled
    const handleSignupToAccept = () => {
        if (emailParam) {
            router.push(`/signup?email=${encodeURIComponent(emailParam)}&redirect=/invite/accept/${token}`);
        }
    };

    const handleAccept = () => {
        if (token) {
            acceptInvitation(token);
        }
    };

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    if (error || !invitation) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-bg-secondary border rounded-2xl p-8 text-center shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-heading-2 font-bold text-black mb-2">
                        Invalid Invitation
                    </h1>
                    <p className="text-body-medium text-gray-600 mb-6">
                        This invitation link is invalid or has expired. Please contact the person who invited you for a new invitation.
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        variant="primary"
                    >
                        Go to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-bg-secondary border rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-purple-600 p-8 text-center">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl text-white mx-auto mb-4 shadow-lg"
                        style={{ backgroundColor: getColorFromId(invitation.organization.id) }}
                    >
                        {invitation.organization.name.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-heading-1 font-bold text-white mb-2">
                        You're Invited!
                    </h1>
                    <p className="text-body-large text-white/90">
                        Join <span className="font-semibold">{invitation.organization.name}</span>
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Invitation Details */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-background rounded-lg border">
                            <Building2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-body-small text-gray-500 mb-1">Organization</p>
                                <p className="text-body-medium-bold text-black">{invitation.organization.name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-background rounded-lg border">
                            <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-body-small text-gray-500 mb-1">Invited by</p>
                                <p className="text-body-medium-bold text-black">
                                    {invitation.inviter.first_name} {invitation.inviter.last_name}
                                </p>
                                <p className="text-body-small text-gray-500">{invitation.inviter.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-background rounded-lg border">
                            <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-body-small text-gray-500 mb-1">Invitation sent to</p>
                                <p className="text-body-medium-bold text-black">{invitation.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        {isAuthenticated && user?.email === invitation.email ? (
                            <>
                                <Button
                                    onClick={handleAccept}
                                    isLoading={isAccepting}
                                    leftIcon={<Check size={20} />}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Accept Invitation
                                </Button>
                                <Button
                                    onClick={() => router.push(`/invite/decline/${token}`)}
                                    variant="ghost"
                                    className="w-full"
                                    disabled={isAccepting}
                                >
                                    Decline
                                </Button>
                            </>
                        ) : emailParam ? (
                            <>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-body-small text-blue-800">
                                        <strong>New here?</strong> You'll need to create an account first to accept this invitation.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleSignupToAccept}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Sign Up to Accept
                                </Button>
                                <Button
                                    onClick={() => router.push(`/login?redirect=/invite/accept/${token}`)}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Already have an account? Log in
                                </Button>
                            </>
                        ) : isAuthenticated && user?.email !== invitation.email ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <p className="text-body-small text-orange-800 mb-3">
                                    <strong>Email mismatch:</strong> You're logged in as <strong>{user?.email}</strong>, but this invitation was sent to <strong>{invitation.email}</strong>.
                                </p>
                                <div className="space-y-2">
                                    <Button
                                        onClick={() => {
                                            // Logout and redirect to login
                                            router.push(`/login?email=${invitation.email}&redirect=/invite/accept/${token}`);
                                        }}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        Log in as {invitation.email}
                                    </Button>
                                    <Button
                                        onClick={() => router.push(`/invite/decline/${token}`)}
                                        variant="ghost"
                                        className="w-full"
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Not authenticated
                            <>
                                <Button
                                    onClick={() => router.push(`/login?redirect=/invite/accept/${token}`)}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Log in to Accept
                                </Button>
                                <Button
                                    onClick={() => router.push(`/invite/decline/${token}`)}
                                    variant="ghost"
                                    className="w-full"
                                >
                                    Decline
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Footer Note */}
                    <div className="pt-4 border-t">
                        <p className="text-body-small text-gray-500 text-center">
                            By accepting this invitation, you'll become a member of <strong>{invitation.organization.name}</strong> and gain access to their resources.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}