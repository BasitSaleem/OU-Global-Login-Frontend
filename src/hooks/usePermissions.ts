import { useAppSelector } from "@/redux/store"
import { Permission } from "@/types/common"

export const usePermissions = (permissions: Permission | Permission[]) => {
    // const permissions = useAppSelector((s) => s.auth.user?.role?.permissions)
    const hasPermission = (
        requiredPermissions: Permission | Permission[],
        checkAll: boolean = false
    ): boolean => {
        const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]
        if (checkAll) {
            return required.every(permission => permissions?.includes(permission))
        }
        else {
            return required.some(permission => permissions?.includes(permission))
        }
    }
    return {
        permissions, hasPermission
    }
}