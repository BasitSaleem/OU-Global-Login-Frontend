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
// Generated on: 2025-11-12T12:55:19.818Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-13T08:43:33.923Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-13T08:47:26.819Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-14T07:43:39.029Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-16T16:01:32.792Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-16T16:19:36.101Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-16T16:28:12.794Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-18T08:31:34.799Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-19T07:00:20.424Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-24T11:57:33.560Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-25T13:34:47.017Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-25T13:37:08.086Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-26T11:54:09.496Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T11:05:24.018Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T11:10:53.383Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T11:12:47.030Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T11:13:24.527Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T11:14:07.118Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T11:19:45.564Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T11:40:29.653Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T12:58:48.015Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-11-27T13:13:02.409Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T10:11:06.871Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T10:12:04.922Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T10:18:40.068Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T10:53:54.404Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T10:55:03.778Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T10:56:28.258Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T10:56:47.328Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T10:57:17.333Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T11:15:05.926Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T11:15:39.673Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-02T11:25:51.959Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-03T07:09:13.485Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-03T07:45:51.556Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-03T11:01:30.698Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-03T11:04:40.525Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-03T11:13:33.920Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-03T11:16:46.067Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-04T10:37:01.435Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-04T10:39:33.134Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-04T11:11:15.540Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-04T15:30:00.978Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-04T15:51:22.686Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-05T07:26:27.728Z
// Total permissions: 11

// Auto-generated permission types
// Generated on: 2025-12-05T07:56:07.328Z
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
