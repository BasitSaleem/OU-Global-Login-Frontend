"use client"
import React, { ReactNode } from 'react';
import { Permission } from '@/types/common';
import { usePermissions } from '@/hooks/usePermissions';
import { useGetAllPermissions } from '@/apiHooks.ts/auth/auth.api';
import { useAppSelector } from '@/redux/store';
interface PermissionGuardProps {
    requiredPermissions: Permission | Permission[];
    checkAll?: boolean;
    fallback?: ReactNode;
    children: ReactNode;
    disableMode?: boolean;
}
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    requiredPermissions,
    checkAll = false,
    fallback = null,
    children,
    disableMode = false
}) => {
    const { user } = useAppSelector((s) => s.auth)
    const { data } = useGetAllPermissions(user?.role_id!)
    const { hasPermission } = usePermissions(data?.data?.permissionsIds);

    const hasAccess = hasPermission(requiredPermissions, checkAll);

    if (!hasAccess) {
        if (disableMode && React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement, {
                disabled: true,
                style: {
                    ...(children as any).props.style,
                    opacity: 0.6,
                    pointerEvents: 'none'
                }
            } as any);
        }
        return <>{fallback}</>;
    }
    return <>{children}</>;
};