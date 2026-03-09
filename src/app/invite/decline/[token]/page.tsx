'use client';

import { useDeclineInvitation } from '@/apiHooks.ts/invitation/invitation.api';
import { Loader } from '@/components/ui';
import { ROUTES } from '@/constants';
import { toast } from '@/hooks/useToast';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeclineInvitePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    const { mutate: declineInvitation, isPending: isDeclining, error } = useDeclineInvitation({
        onSuccess: () => {
            router.push(ROUTES.LOGIN);
        }
    });
    useEffect(() => {
        if (!token) {
            toast.info("Token not found", "Token not found")
            router.push(ROUTES.LOGIN)
        }
        declineInvitation(token, {
            onSuccess: () => toast.success(
                "Invitation declined",
                "The invitation has been declined."
            )
        });
    }, []);
    if (isDeclining) {
        return <Loader text='Declining Invitation' />
    }
    if (error) {
        router.push(ROUTES.LOGIN)
    }
}