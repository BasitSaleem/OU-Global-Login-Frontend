"use client";
import { PublicRoute } from "@/components/HOCs/publicRoute.guard";
import { Logo } from "@/components/ui";
import { Modal } from "@/components/modals/GenericModal";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useLogin, useVerifyMfaLogin } from "@/apiHooks.ts/auth/auth.api";
import { useAppDispatch } from "@/redux/store";
import { setAuth } from "@/redux/slices/auth.slice";
import { ROUTES } from "@/constants";

import { signinData } from "@/apiHooks.ts/auth/auth.types";
import { AuthContext } from "@/contexts/auth-context";
import logger from "@/utils/logger";

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
  const [showMfa, setShowMfa] = useState(false);
  const [mfaToken, setMfaToken] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const { mutate: verifyMfaLogin, isPending: isMfaPending } =
    useVerifyMfaLogin();

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
      onSuccess: (response: any) => {
        if (response.data?.requires_mfa) {
          setMfaToken(response.data.mfa_token);
          setShowMfa(true);
          return;
        }

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
          logger.log(response_redirect_url, "response_redirect_url");
          router.replace(response_redirect_url);
        } else if (search_redirect_uri) {
          logger.log(search_redirect_uri, "search_redirect_uri");

          router.push(search_redirect_uri);
        } else {
          logger.log("ROUTES.DASHBOARD");

          router.push(ROUTES.DASHBOARD);
        }
      },
    });
  };

  const triggerMfa = (token: string) => {
    setMfaToken(token);
    setShowMfa(true);
  };

  const contextValue = {
    onSubmit,
    isPending,
    error,
    triggerMfa,
  };
  const Content = (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
  return (
    <div className="min-h-screen bg-card relative overflow-hidden">
      <div className="absolute inset-0 opacity-40"></div>

      <div className="relative z-10 flex items-center  justify-between p-4 sm:p-6 lg:p-8">
        <a
          href="https://ownersinventory.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Logo Icon="ownersInventory" className="cursor-pointer" />
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          {pathname === "/login" ? (
            <span className="text-xs sm:text-sm hidden sm:block text-text">
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

      <Modal
        isOpen={showMfa}
        onClose={() => {
          setShowMfa(false);
          setMfaCode("");
        }}
        size="md"
      >
        <Modal.Header>
          <Modal.Title>Two-Factor Authentication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-sm text-center mb-4 text-gray-400">
            {useRecoveryCode
              ? "Enter one of your 8-character recovery codes."
              : "Enter the 6-digit code from your authenticator app."}
          </p>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md mb-2 bg-transparent text-text border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={useRecoveryCode ? "e.g. a1b2c3d4" : "000000"}
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
          />
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setUseRecoveryCode(!useRecoveryCode);
                setMfaCode("");
              }}
              className="text-xs text-primary hover:underline"
            >
              {useRecoveryCode
                ? "Use Authenticator App instead"
                : "Lost your device? Use a recovery code"}
            </button>
          </div>
          <button
            onClick={() => {
              verifyMfaLogin(
                { mfa_token: mfaToken, code: mfaCode },
                {
                  onSuccess: (response: any) => {
                    const response_redirect_url = response.data?.redirect_url;
                    const search_redirect_uri =
                      searchParams.get("redirect_uri");
                    dispatch(
                      setAuth({
                        user: response.data?.user!,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                      }),
                    );
                    setShowMfa(false);
                    if (response_redirect_url) {
                      router.replace(response_redirect_url);
                    } else if (search_redirect_uri) {
                      router.push(search_redirect_uri);
                    } else {
                      router.push(ROUTES.DASHBOARD);
                    }
                  },
                },
              );
            }}
            disabled={isMfaPending || !mfaCode}
            className="w-full py-2 bg-primary text-white rounded-full font-bold disabled:opacity-50"
          >
            {isMfaPending ? "Verifying..." : "Verify Code"}
          </button>
          <button
            onClick={() => setShowMfa(false)}
            className="w-full mt-2 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AuthLayout;
