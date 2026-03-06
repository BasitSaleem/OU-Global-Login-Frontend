'use client';

import { useAcceptInvitation, useGetInvitationStatus } from '@/apiHooks.ts/invitation/invitation.api';
import { useParams, useRouter } from 'next/navigation';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
import { ROUTES } from '@/constants';
import { toast } from '@/hooks/useToast';
import { Loader } from '@/components/ui';
import { useEffect } from 'react';

export default function AcceptInvitePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const { data: statusData, isPending: isStatusPending, error } =
        useGetInvitationStatus(token);

    const { data: me, isPending: isMePending } = useGetMe();

    const { mutate: acceptInvitation, isPending: isAccepting } =
        useAcceptInvitation({
            onSuccess: () => {
                router.replace(ROUTES.DASHBOARD);
            },
        });

    useEffect(() => {
        if (isStatusPending || isMePending || isAccepting) return;

        if (error) {
            toast.info('Invitation not found', 'Invitation not found');
            router.replace(ROUTES.LOGIN);
            return;
        }

        if (!statusData) return;

        const { inviteStatus, userStatus, email } = statusData;
        const currentPath = `/invite/check/${token}`;

        // USER LOGGED IN
        if (me?.data?.user) {
            if (inviteStatus === 'PENDING') {
                acceptInvitation(token);
                return;
            }

            if (inviteStatus === 'ACCEPTED') {
                toast.info('Already Accepted', 'Invitation already accepted');
                router.replace(ROUTES.DASHBOARD);
                return;
            }

            if (inviteStatus === 'REJECTED') {
                toast.info('Already Declined', 'Invitation already declined');
                router.replace(ROUTES.DASHBOARD);
                return;
            }
        }

        // USER NOT LOGGED IN
        const redirectParams =
            `?app=OG&token=${encodeURIComponent(token)}` +
            `${email ? `&email=${encodeURIComponent(email)}` : ''}` +
            `&redirect_uri=${encodeURIComponent(currentPath)}`;

        if (inviteStatus === 'PENDING') {
            router.replace(
                userStatus === 'EXIST'
                    ? `${ROUTES.LOGIN}${redirectParams}`
                    : `${ROUTES.REGISTER}${redirectParams}`
            );
            return;
        }

        if (inviteStatus === 'ACCEPTED') {
            toast.info('Already Accepted', 'Invitation already accepted');
            router.replace(ROUTES.LOGIN);
            return;
        }

        if (inviteStatus === 'REJECTED') {
            toast.info('Already Declined', 'Invitation already declined');
            router.replace(ROUTES.LOGIN);
        }
    }, [
        statusData,
        me,
        isStatusPending,
        isMePending,
        isAccepting,
        error,
        token,
        router,
        acceptInvitation,
    ]);

    return (
        <Loader
            text={
                isAccepting
                    ? 'Accepting Invitation'
                    : isStatusPending || isMePending
                        ? 'Checking Invitation Status'
                        : 'Redirecting'
            }
        />
    );
}
