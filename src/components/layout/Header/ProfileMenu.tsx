import { useLogout } from "@/apiHooks.ts/auth/auth.api";
import { PermissionGuard } from "@/components/HOCs/permission-guard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui";
import { GlobalLoading } from "@/components/ui/loading";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { clearAuth } from "@/redux/slices/auth.slice";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ProfileMenuProps {
    onClose: () => void;
    open: boolean
}

export default function ProfileMenu({ onClose, open }: ProfileMenuProps) {
    const { user } = useAppSelector((s) => s.auth);
    const { mutate: logout, isPending } = useLogout();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                onClose();
                dispatch(clearAuth());
                router.push("/login");
            },
            onError: (error) => {
                console.error("Logout failed:", error);
            },
        });
    };
    if (!open) {
        return null
    }
    return (
        <div className="absolute -right-3 sm:right-0 top-10 w-64 sm:w-72 bg-bg-secondary border  rounded-lg shadow-lg z-50">
            {isPending && (
                <GlobalLoading text="Logging out" />
            )}

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 border-b ">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-primary"
                >
                    {user?.profile_url ?
                        <Image
                            className="w-8 h-8 rounded-full object-cover"
                            src={user?.profile_url}
                            alt="profile"
                            width={100}
                            height={100}

                        />
                        : <span className="text-white">
                            {`${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""
                                }`.toUpperCase()}
                        </span>}
                </div>
                <div>
                    <h3 className="text-body-medium-bold text-gray-900">{user?.first_name}</h3>
                    <p className="text-xs text-text truncate">
                        {user?.email}
                    </p>
                </div>
            </div>

            <div className="p-3 space-y-2">


                <Link href={"/user-profile"}
                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:text-[#ffff] rounded-lg  hover:bg-primary/80  cursor-pointer"
                >

                    <SvgIcon name="profile" className="w-6 h-6" />
                    <span className=" ">Profile</span>
                </Link>
                <PermissionGuard
                    requiredPermissions="og:access::setting"
                >
                    <Link href="/account-setting" className="w-full flex items-center hover:text-[#ffff] gap-2 px-0.5 py-0.5 rounded-lg hover:bg-primary/80   cursor-pointer">

                        <SvgIcon name="settings" className="w-8 h-8" width={14} height={14} />
                        <span className="">Account settings</span>
                    </Link>
                </PermissionGuard>
                <Button
                    onClick={() => handleLogout()}
                    leftIcon={<SvgIcon name="logout" className="w-6 h-6" />}
                    variant="basic"
                    className="w-full flex items-center text-black  justify-start gap-2 px-2 py-[18px] hover:text-[#ffff] hover:bg-red-500/80 rounded-lg"
                >
                    <span className="">Log out</span>
                </Button>
            </div>
        </div>
    );
}