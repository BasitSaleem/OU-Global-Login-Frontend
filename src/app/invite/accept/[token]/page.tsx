'use client';

import { useGetInvitationByToken, useAcceptInvitation } from '@/apiHooks.ts/invitation/invitation.api';
import { LoadingSpinner } from '@/components/ui';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '@/components/ui/loading';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';

export default function AcceptInvitePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = params.token as string;
    const emailParam = searchParams.get('email');

    // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: me } = useGetMe()
    const { mutate: acceptInvitation, isPending: isAccepting } = useAcceptInvitation({
        onSuccess: () => {
            router.push('/organizations');
        },
    });
    console.log(me)
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

    useEffect(() => {
        checkAuth()
    }, [])
    const checkAuth = () => {
        if (!me?.data?.user) {
            router.push(ROUTES.LOGIN + (token ? `&token=${token}` : ''))
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