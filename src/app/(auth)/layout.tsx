"use client"
import { PublicRoute } from '@/components/guards/publicRoute.guard';
import { Logo } from '@/components/ui';
import { GlobalLoading } from '@/components/ui/loading';
import { Icons } from '@/components/utils/icons';
import { setSSOStatus } from '@/redux/slices/auth.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
interface AuthLayoutProp {
    children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProp) => {
    const dispatch = useAppDispatch();
    const ssoStatus = useAppSelector((s) => s.auth.setSSO)
    const searchParams = useSearchParams();
    const app = searchParams.get("app") || "OG";
    console.log("SSO RETURN URL:: ");
    if (ssoStatus) {
        console.log("SSO STATUS:: ", ssoStatus);
        dispatch(setSSOStatus(false));
        
        return (
            <GlobalLoading text='redirecting after sso' />
        )
    }
    return (
        <div className="min-h-screen bg-card relative overflow-hidden">
            {/* Background decorative image */}
            <div className="absolute inset-0 opacity-40">
            </div>

            {/* Header with logo and sign in */}
            <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8">
                <Logo Icon={app === "OI" ? Icons.OI : Icons.owneruniverse} />
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm hidden sm:block">
                        Already have an account?
                    </span>
                    <Link
                        href={`/login?app=${app}`}
                        className="bg-primary border hover:bg-primary/80 text-btn-text text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
            {/* <PublicRoute redirectTo={ssoReturnUrl ?? '/'}> */}
                {children}
            {/* </PublicRoute> */}
            <div className="fixed bottom-[24px] inset-x-0 z-10 pb-2 sm:pb-0 flex justify-center">
                <p className="text-xs text-center">
                    ©2025 Owners Inventory - All rights reserved
                </p>
            </div>

        </div >
    )
}

export default AuthLayout