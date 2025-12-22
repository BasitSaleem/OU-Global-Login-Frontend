"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/helpers';
import { IconName, SvgIcon } from '@/components/ui/SvgIcon';
import { OgOrganization } from '@/apiHooks.ts/organization/organization.types';

interface OrgSidebarProps {
    collapsed: boolean;
    className?: string;
    organizationDetails: OgOrganization;
}

const sidebarItems: { label: string; href: (orgId: string) => string; icon: IconName }[] = [
    {
        label: 'Payment Methods',
        href: (orgId) => `/organization-details/${orgId}/payment-methods`,
        icon: 'payment-methods'
    },
    {
        label: 'Billings',
        href: (orgId) => `/organization-details/${orgId}/billing`,
        icon: 'billing'
    },
    {
        label: 'Notifications',
        href: (orgId) => `/organization-details/${orgId}/notifications`,
        icon: 'notification'
    }
];

export default function OrgSidebar({ collapsed, className, organizationDetails }: OrgSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "flex-shrink-0 bg-background border-r h-full transition-all duration-300 ease-in-out",
                collapsed ? "w-17" : "w-70",
                className
            )}
        >
            <Link
                href="/"
                className={cn(
                    "h-14 flex items-center justify-start border-b cursor-pointer",
                    collapsed ? "px-3" : "px-3"
                )}
            >
                {collapsed ? (
                    <div className="w-9 h-9 rounded flex items-center justify-center bg-primary/10">
                        <SvgIcon name="ownersUniverseColl" className=" w-[18px] h-[18px]" />
                    </div>
                ) : (
                    <SvgIcon
                        name="ownersUniverse"
                        className="text-foreground"
                        width={130}
                        height={130}
                    />
                )}
            </Link>
            <nav className="px-3 py-1.5 space-y-1 ">
                <div
                    className={cn(
                        "flex items-center text-sm font-medium rounded-lg transition-colors p-2 mb-2 text-icon",
                        collapsed
                            ? "justify-center bg-primary/10 "
                            : "ml-1"
                    )}
                >
                    {collapsed ? (
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold">
                            {organizationDetails?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)}
                        </span>
                    ) : (
                        organizationDetails?.name
                    )}
                </div>
                {sidebarItems.map((item) => {
                    const href = item.href(organizationDetails?.id);
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center text-sm font-medium rounded-lg transition-colors p-2",
                                collapsed ? "justify-center px-0" : "p-3",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-primary/10 hover:text-primary"
                            )}
                        >
                            {collapsed ? (
                                <SvgIcon name={item.icon} width={20} height={20} className='text-icon' />
                            ) : (
                                <span className='flex items-center w-full gap-3'>
                                    <SvgIcon name={item.icon} width={20} height={20} className='text-icon ' />
                                    <span className="truncate">{item.label}</span>
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
