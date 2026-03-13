"use client";
import { PublicRoute } from "@/components/HOCs/publicRoute.guard";
import { Logo } from "@/components/ui";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useLogin } from "@/apiHooks.ts/auth/auth.api";
import { useAppDispatch } from "@/redux/store";
import { setAuth } from "@/redux/slices/auth.slice";
import { ROUTES } from "@/constants";
import { signInResponse } from "@/types/auth.types";
import { signinData } from "@/apiHooks.ts/auth/auth.types";
import { AuthContext } from "@/contexts/auth-context";

// interface AuthContextType {
//     onSubmit: (data: signinData) => void;
//     isPending: boolean;
//     error: any;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuthContext = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuthContext must be used within an AuthProvider');
//     }
//     return context;
// };
interface AuthLayoutProp {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProp) => {
  const { mutate: login, isPending, error } = useLogin();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [oauthParams, setOauthParams] = useState<any>({});

  const pathname = usePathname();
  const app = searchParams.get("app") || "OG";
  const redirectUrlParam =
    searchParams.get("redirect_url") || searchParams.get("redirect_uri");

  useEffect(() => {
    if (searchParams.get("client_id")) {
      const data = {
        client_id: searchParams.get("client_id"),
        redirect_uri: searchParams.get("redirect_uri"),
        scope: searchParams.get("scope"),
        state: searchParams.get("state"),
        nonce: searchParams.get("nonce"),
        response_type: searchParams.get("response_type"),
        code_challenge: searchParams.get("code_challenge"),
        code_challenge_method: searchParams.get("code_challenge_method"),
        subdomain: searchParams.get("subdomain"),
      };
      setOauthParams(data);
    }
  }, [searchParams]);

  const onSubmit = (formData: signinData) => {
    const fullData = {
      ...formData,
      ...oauthParams,
    };

    login(fullData, {
      onSuccess: (response: signInResponse) => {
        const response_redirect_url = response.data?.redirect_url;
        const search_redirect_uri = searchParams.get("redirect_uri");
        dispatch(
          setAuth({
            user: response.data?.user!,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }),
        );
        if (response_redirect_url) {
          console.log(response_redirect_url, "response_redirect_url");
          router.replace(response_redirect_url);
        } else if (search_redirect_uri) {
          console.log(search_redirect_uri, "search_redirect_uri");

          router.push(search_redirect_uri);
        } else {
          console.log("ROUTES.DASHBOARD");

          router.push(ROUTES.DASHBOARD);
        }
      },
    });
  };

  const contextValue = {
    onSubmit,
    isPending,
    error,
  };
  const Content = (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
  return (
    <div className="min-h-screen bg-card relative overflow-hidden">
      <div className="absolute inset-0 opacity-40"></div>

      <div className="relative z-10 flex items-center  justify-between p-4 sm:p-6 lg:p-8">
        <a href="https://ownersinventory.com/" target="_blank" rel="noopener noreferrer">
          <Logo Icon="ownersInventory" className="cursor-pointer" />
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          {pathname === "/login" ? (
            <span className="text-xs sm:text-sm hidden sm:block">
              Don't have an account?
            </span>
          ) : (
            <span className="text-xs sm:text-sm hidden sm:block text-text">
              Already have an account?
            </span>
          )}
          {pathname === "/login" ? (
            <Link
              href={`/sign-up?app=${app}`}
              className="bg-primary border hover:bg-primary/80 text-btn-text text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
            >
              Sign Up
            </Link>
          ) : (
            <Link
              href={`/login?app=${app}`}
              className="bg-primary border hover:bg-primary/80 text-btn-text text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
      {!redirectUrlParam ? <PublicRoute>{Content}</PublicRoute> : Content}

      <div className="mt-6 inset-x-0 z-10 pb-6 sm:pb-8 flex justify-center">
        <p className="text-xs text-center text-text">
          © {new Date().getFullYear()} Owners Inventory - All rights reserved
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
