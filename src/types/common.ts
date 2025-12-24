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



export type Permission =
  | "og:create::organization"
  | "og:delete::organization"
  | "og:favorite::organization"
  | "og:edit::password"
  | "og:access::notification_preferences"
  | "og:access::setting"
  | "og:access::products"
  | "og:view::all_products"
  | "og:view::all_notifications"
  | "og:edit::profile"
  | "og:edit::email"

export interface WithPermissionsProps {
  userPermissions: Permission[];
}
