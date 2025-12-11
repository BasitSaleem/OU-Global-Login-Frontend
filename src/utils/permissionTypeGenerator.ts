
import { User } from "@/types/auth.types";
import { syncPermissionsToFile } from "@/actions/sync-permissions.action";

export class PermissionTypeGenerator {
    private static readonly STORAGE_KEY = 'user_permissions';
    private static readonly TYPE_GENERATION_KEY = 'permissions_type_generated';

    static extractPermissionsFromResponse(user: User): string[] {
        try {
            return user.role?.permissions || [];
        } catch (error) {
            console.error('Error extracting permissions from response:', error);
            return [];
        }
    }
    static storePermissions(permissions: string[]): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(permissions));
        } catch (error) {
            console.error('Error storing permissions:', error);
        }
    }

    static getStoredPermissions(): string[] {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading stored permissions:', error);
            return [];
        }
    }

    static generateTypeDefinition(permissions: string[]): string {
        if (permissions.length === 0) {
            return `export type Permission = never; // No permissions found`;
        }

        const permissionTypes = permissions
            .map(permission => `  | "${permission}"`)
            .join('\n');

        return `// Auto-generated permission types
// Generated on: ${new Date().toISOString()}
// Total permissions: ${permissions.length}

export type Permission = 
${permissionTypes};
`;
    }


    static downloadTypeFile(permissions: string[]): void {
        if (typeof window === 'undefined') return;

        const typeDefinition = this.generateTypeDefinition(permissions);
        const blob = new Blob([typeDefinition], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'permissions-types.ts';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(' Permission types file downloaded');
    }


    static async processSignInResponse(user: User): Promise<string[]> {
        const permissions = this.extractPermissionsFromResponse(user);

        if (permissions.length === 0) {
            console.warn('No permissions found in sign-in response');
            return [];
        }
        this.storePermissions(permissions);
        if (process.env.NODE_ENV === 'development') {
            try {
                const result = await syncPermissionsToFile(permissions);
                if (result.success) {
                } else {
                    console.error(` Failed to sync permissions: ${result.message}`);
                }
            } catch (error) {
                console.error(' Error calling server action:', error);
            }

        }

        return permissions;
    }


    static clearPermissions(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(this.STORAGE_KEY);
        console.log('Cleared stored permissions');
    }

}
