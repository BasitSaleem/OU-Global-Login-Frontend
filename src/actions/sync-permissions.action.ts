'use server';

import fs from 'fs';
import path from 'path';
const TYPES_FILE_PATH = path.join(process.cwd(), 'src/types/common.ts');
const PERMISSION_START_MARKER = 'export type Permission =';
const PERMISSION_END_MARKER = '\nexport interface WithPermissionsProps';
interface SyncResult {
  success: boolean;
  message: string;
  permissionCount?: number;
}

function generatePermissionType(permissions: string[]): string {
  if (!permissions || permissions.length === 0) {
    return `export type Permission = never; // No permissions found`;
  }

  const permissionTypes = permissions
    .map(permission => `  | "${permission}"`)
    .join('\n');
  return `// Auto-generated permission types
// Generated on: ${new Date().toISOString()}
// Total permissions: ${permissions.length}

export type Permission =
${permissionTypes}`;
}

export async function syncPermissionsToFile(permissions: string[]): Promise<SyncResult> {
  if (process.env.NODE_ENV !== 'development') {
    return {
      success: false,
      message: 'Permission sync is only available in development mode'
    };
  }

  try {
    if (!Array.isArray(permissions) || permissions.length === 0) {
      return {
        success: false,
        message: 'No permissions provided or invalid format'
      };
    }
    const fileContent = await fs.promises.readFile(TYPES_FILE_PATH, 'utf8');
    const startIndex = fileContent.indexOf(PERMISSION_START_MARKER);
    const endIndex = fileContent.indexOf(PERMISSION_END_MARKER);
    if (startIndex === -1 || endIndex === -1) {
      return {
        success: false,
        message: 'Could not find Permission type markers in common.ts file'
      };
    }

    const newPermissionType = generatePermissionType(permissions);
    const beforePermission = fileContent.substring(0, startIndex);
    const afterPermission = fileContent.substring(endIndex);
    const newContent = beforePermission + newPermissionType + '\n' + afterPermission;
    await fs.promises.writeFile(TYPES_FILE_PATH, newContent, 'utf8');
    return {
      success: true,
      message: `Successfully updated ${permissions.length} permissions`,
      permissionCount: permissions.length
    };
  } catch (error) {
    console.error('Error syncing permissions:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
