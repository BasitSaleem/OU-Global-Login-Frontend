'use client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '../ui/loading';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}
//PUBLIC ROTE WRAPPER THAT WILL BE SHOWN WHEN A USER IS AUTHENTICATED
export function PublicRoute({
  children,
  redirectTo = ROUTES.HOME,
  fallback
}: PublicRouteProps) {
  const router = useRouter();
  
  // const searchParams = useSearchParams();
  // const { isAuthenticated } = useAppSelector((state) => state.auth);
  // const [isChecking, setIsChecking] = useState(true);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsChecking(false);
  //   }, 100);
  
  //   return () => clearTimeout(timer);
  // }, []);
  const { data, isLoading, isError } = useGetMe()
  // console.log(isError, );

  // useEffect(() => {
    if (!isLoading && !isError && data?.data?.user) {
      const destination = redirectTo;
      console.log('Destination: ', destination);
      router.replace(destination);

    }
  // }, [router, data, redirectTo]);

  if (isLoading) {
    return fallback || (
      <GlobalLoading text='checking in the public guard' />
    );
  }

  // if (isError && !data?.data?.user) {
  //   return null;
  // }
  return <>{children}</>;
}