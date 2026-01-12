"use client"
import { AuthGuard } from '@/components/HOCs/auth-guard';
import { PublicRoute } from '@/components/HOCs/publicRoute.guard';
import { Logo } from '@/components/ui';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
interface AuthLayoutProp {
    children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProp) => {
    const searchParams = useSearchParams();
    const app = searchParams.get("app") || "OG";
    return (
        <div className="min-h-screen bg-card relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
            </div>

            <div className="relative z-10 flex items-center  justify-between p-4 sm:p-6 lg:p-8">
                <Logo Icon="ownersInventory" className='cursor-pointer' />
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
            <PublicRoute>
                {children}
            </PublicRoute>

            <div className="mt-16 sm:mt-28 lg:mt-44 inset-x-0 z-10 pb-6 sm:pb-8 flex justify-center">
                <p className="text-xs text-center">
                    © {new Date().getFullYear()} Owners Inventory - All rights reserved
                </p>
            </div>

        </div >
    )
}

export default AuthLayout