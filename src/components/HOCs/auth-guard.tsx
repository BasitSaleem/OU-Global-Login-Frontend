'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
import { useAppDispatch } from '@/redux/store';
import { setOrganization } from '@/redux/slices/auth.slice';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    error
  } = useGetMe();
  const organization = data?.data?.user?.organizations?.[0] ?? data?.data?.user?.memberships?.[0]?.organization ?? undefined
  console.log(organization, "organization");
  if (organization !== undefined) {
    console.log("organization is not undefined");
    dispatch(setOrganization(organization))
  }

  // useEffect(() => {
  //   if (!isLoading && (isError || !data?.user)) {
  //     router.push(ROUTES.LOGIN);
  //   }
  // }, [isLoading, isError, data, router]);

  if (isLoading) {
    return (
      fallback
    );
  }

  // Show error state or login page
  if (!isLoading && isError && !data?.data.user) {
    router.replace(ROUTES.LOGIN)
  }
  else {
    return <>{children}</>;
  }
}
// "memberships": [
//                 {
//                     "id": "769d4d93-aa1c-487b-b6f9-957083977b7d",
//                     "role": "MEMBER",
//                     "createdAt": "2025-12-05T12:59:46.153Z",
//                     "organization": {
//                         "id": "8b15c5e2-6498-4ff7-b669-e908d3023cb6",
//                         "name": "fist",
//                         "created_at": "2025-12-05T07:36:44.121Z"
//                     }
//                 }
//             ]