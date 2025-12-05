'use client';

import { useGetInvitationByToken, useAcceptInvitation } from '@/apiHooks.ts/invitation/invitation.api';
import { LoadingSpinner } from '@/components/ui';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '@/components/ui/loading';

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
        },
    });

    // For new users, redirect to signup with email pre-filled
    // const handleSignupToAccept = () => {
    //     if (emailParam) {
    //         router.push(`/signup?email=${encodeURIComponent(emailParam)}&redirect=/invite/accept/${token}`);
    //     }
    // };

    // const handleAccept = () => {
    //     if (token) {
    //         acceptInvitation(token);
    //     }
    // };

    // if (isLoading) {
    //     return (
    //         <LoadingSpinner />
    //     );
    // }
    useEffect(() => {
        checkAuth()
    }, [])
    const checkAuth = () => {
        if (!isAuthenticated) {
            router.push(ROUTES.LOGIN + (token ? `?token=${token}` : ''))
        }
        else {
            acceptInvite()
            router.push('/organizations')
        }
    }
    const acceptInvite = () => {
        acceptInvitation(token)
    }

    if (isAccepting) {
        return <GlobalLoading text='Accepting Invitation' />
    }
}