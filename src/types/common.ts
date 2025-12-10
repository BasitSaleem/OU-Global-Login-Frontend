export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

export type Invitation = {
  id: string;
  name: string;
  abbreviation: string;
  backgroundColor: string;
  invitedBy: string;
  product: string;
  timeAgo: string;
};

// Auto-generated permission types
// Generated on: 2025-12-08T10:46:45.837Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T10:48:26.077Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T10:49:09.005Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T10:50:29.293Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T10:51:53.907Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T10:54:19.526Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T10:57:03.045Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T10:58:46.386Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T11:13:07.916Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-08T11:22:29.570Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-09T10:06:01.992Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-09T10:07:07.313Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-10T07:19:25.219Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-10T14:21:31.517Z
// Total permissions: 11

export type Permission =
  | "og:create::organization"
  | "og:delete::organization"
  | "og:favorite::organization"
  | "og:edit::password"
  | "og:access::notification_preferences"
  | "og:edit::email"
  | "og:access::setting"
  | "og:access::products"
  | "og:view::all_products"
  | "og:view::all_notifications"
  | "og:edit::profile"

export interface WithPermissionsProps {
  userPermissions: Permission[];
}
