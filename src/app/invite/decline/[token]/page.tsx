'use client';

import { useGetInvitationByToken, useDeclineInvitation } from '@/apiHooks.ts/invitation/invitation.api';
import { Button } from '@/components/ui';
import { getColorFromId } from '@/utils/getRandomColors';
import { X, Loader2, Mail, Building2, User, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function DeclineInvitePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const { data: invitation, isLoading, error } = useGetInvitationByToken(token, !!token);
    const { mutate: declineInvitation, isPending: isDeclining } = useDeclineInvitation({
        onSuccess: () => {
            router.push('/');
        }
    });

    const handleDecline = () => {
        if (token) {
            declineInvitation(token);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-body-medium text-gray-600">Loading invitation...</p>
                </div>
            </div>
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
                        This invitation link is invalid or has expired. Please contact the person who invited you for more information.
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
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-red-500 to-orange-600 p-8 text-center">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl text-white mx-auto mb-4 shadow-lg"
                        style={{ backgroundColor: getColorFromId(invitation.organization.id) }}
                    >
                        {invitation.organization.name.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-heading-1 font-bold text-white mb-2">
                        Decline Invitation
                    </h1>
                    <p className="text-body-large text-white/90">
                        You're about to decline the invitation to <span className="font-semibold">{invitation.organization.name}</span>
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

                    {/* Warning Message */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-body-small text-orange-800">
                            <strong>Note:</strong> If you decline this invitation, you won't be able to join {invitation.organization.name} unless you receive a new invitation.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-3">
                        <Button
                            onClick={() => router.push(`/invite/accept/${token}`)}
                            variant="primary"
                            className="w-full"
                            disabled={isDeclining}
                        >
                            Go Back to Accept
                        </Button>
                        <Button
                            onClick={handleDecline}
                            isLoading={isDeclining}
                            leftIcon={<X size={20} />}
                            variant="destructive"
                            className="w-full"
                        >
                            Confirm Decline
                        </Button>
                    </div>

                    {/* Footer Note */}
                    <div className="pt-4 border-t">
                        <p className="text-body-small text-gray-500 text-center">
                            Declining this invitation will remove it from your pending invitations and notify the organization.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}