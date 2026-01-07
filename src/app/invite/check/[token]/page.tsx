'use client';

import { useAcceptInvitation, useGetInvitationStatus } from '@/apiHooks.ts/invitation/invitation.api';
import { useParams, useRouter } from 'next/navigation';
import { GlobalLoading } from '@/components/ui/loading';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
import { ROUTES } from '@/constants';
import { toast } from '@/hooks/useToast';

export default function AcceptInvitePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    const { data: statusData, isPending: isStatusPending, error } = useGetInvitationStatus(token)
    const { data: me } = useGetMe()
    const { mutate: acceptInvitation, isPending: isAccepting } = useAcceptInvitation({
        onSuccess: () => {
            router.push('/organizations');
        },
    });
    if (error) {
        toast.info("Invitation not found", "Invitation not found")
        router.push(ROUTES.LOGIN)
    }
    const handleAccept = () => {
        if (token) {
            acceptInvitation(token);
        }
    };
    if (me?.data?.user) {
        if (statusData?.inviteStatus === "ACCEPTED") {
            toast.info("Already Accepted", "Invitation already accepted")
            router.push(ROUTES.DASHBOARD);
        }
        if (statusData?.inviteStatus === "PENDING") {
            handleAccept()
        }
    }
    if (!me?.data?.user && statusData?.inviteStatus === "PENDING") {

        if (statusData?.userStatus === "EXIST") {
            router.push(ROUTES.LOGIN + (token ? `&token=${encodeURIComponent(token)}` : '') + (statusData.email ? `&email=${encodeURIComponent(statusData.email)}` : ""))
        }
        if (statusData?.userStatus === "NOT_EXIST") {
            router.push(ROUTES.REGISTER + (token ? `&token=${encodeURIComponent(token)}` : '') + (statusData.email ? `&email=${encodeURIComponent(statusData.email)}` : ""))
        }
    }
    if (!me?.data?.user && statusData?.inviteStatus === "ACCEPTED") {
        toast.info("Already Accepted", "Invitation already accepted")
        router.push(ROUTES.LOGIN);
    }
    if (!me?.data?.user && statusData?.inviteStatus === "REJECTED") {
        toast.info("Already Declined", "Invitation already declined")
        router.push(ROUTES.LOGIN);
    }

    // For new users, redirect to signup with email pre-filled
    // const handleSignupToAccept = () => 
    //     if (emailParam) {
    //         router.push(`/signup?email=${encodeURIComponent(emailParam)}&redirect=/invite/accept/${token}`);
    //     }
    // };



    // useEffect(() => {
    //     checkAuth()
    // }, [])
    // const checkAuth = () => {
    //     if (!me?.data?.user) {
    //         router.push(ROUTES.LOGIN + (token ? `&token=${token}` : ''))
    //     }
    //     else {
    //         acceptInvite()
    //         router.push('/organizations')
    //     }
    // }
    // const acceptInvite = () => {
    //     acceptInvitation(token)
    // }
    if (isStatusPending) {
        return <GlobalLoading text='Checking Invitation Status' />
    }
    if (isAccepting) {
        return <GlobalLoading text='Accepting Invitation' />
    }
}