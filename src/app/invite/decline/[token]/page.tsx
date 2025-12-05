'use client';

import { useDeclineInvitation } from '@/apiHooks.ts/invitation/invitation.api';
import { GlobalLoading } from '@/components/ui/loading';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeclineInvitePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    const { mutate: declineInvitation, isPending: isDeclining } = useDeclineInvitation({
        onSuccess: () => {
            router.push('/');
        }
    });
    useEffect(() => {
        declineInvite();
    }, []);

    const declineInvite = () => {
        if (token) {
            declineInvitation(token)
        }
    }
    if (isDeclining) {
        return <GlobalLoading text='Declining Invitation' />
    }

}