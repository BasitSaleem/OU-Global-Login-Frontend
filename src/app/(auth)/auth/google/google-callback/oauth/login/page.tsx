"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useLoginWithGoogle } from "@/apiHooks.ts/auth/auth.api";
import { useAppDispatch } from "@/redux/store";
import { setAuth } from "@/redux/slices/auth.slice";
import GoogleButton from "@/components/ui/GoogleButton";
import app from "next/app";
import Link from "next/link";
import { useAuthContext } from "@/contexts/auth-context";
export default function GoogleCallback() {
  const router = useRouter();
  const { mutate: loginWithGoogle } = useLoginWithGoogle();
  const dispatch = useAppDispatch();

  const { triggerMfa } = useAuthContext();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) return;
    loginWithGoogle(
      { code },
      {
        onSuccess: (response: any) => {
          if (response.data?.requires_mfa) {
            if (triggerMfa) {
              triggerMfa(response.data.mfa_token);
            }
            return;
          }

          if (response.isNewUser) {
            router.push("/create-organization");
          } else {
            dispatch(
              setAuth({
                user: response.data?.user!,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              }),
            );
            router.push("/dashboard");
          }
        },
        onError: (error: any) => {
          router.push("/login");
        },
      },
    );
  }, []);

  return (
    <main className="flex items-center justify-center px-6 pb-4 md:pt-1 pt-20">
      <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
        <div className="bg-bg-secondary rounded-2xl sm:rounded-2xl px-4 sm:px-14 py-3 sm:py-4">
          <div className="text-center mb-3 mt-2 sm:mb-4">
            <h1 className="text-base sm:text-xl font-bold text-text">
              Welcome back
            </h1>
          </div>
          <form className="space-y-2 sm:space-y-3">
            <Input
              id="email"
              label="Email"
              type="email"
              disabled={true}
              placeholder="Enter Email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter Password"
              isPassword={true}
              disabled={true}
            />
            <div className="flex items-center justify-between pt-1 sm:pt-2">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  className="w-3 h-3 sm:w-4 sm:h-4 border bg-primary rounded  focus:ring-primary cursor-not-allowed"
                />
                <span className="text-xs font-semibold">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-primary underline hover:underline cursor-not-allowed"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="pt-2 sm:pt-3 sm:mt-5">
              <Button
                type="submit"
                disabled={true}
                variant="primary"
                className="w-full h-8 sm:h-9 text-white text-xs bg-primary hover:bg-primary/80 sm:text-sm font-bold rounded-full         hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.30),0_1px_3px_1px_rgba(60,64,67,0.15)]"
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="my-3 sm:my-7 flex items-center">
            <div className="flex-1 border-t border"></div>
            <span className="px-2 sm:px-3 text-xs sm:text-sm">Or</span>
            <div className="flex-1 border-t border"></div>
          </div>

          <div className="space-y-2 sm:space-y-5 ">
            <GoogleButton
              text="Sign in with Google"
              className="w-full"
              isLoading={true}
            />
          </div>

          <div className="mt-3 sm:mt-4 text-center">
            <span className="text-xs sm:text-sm">Don't have an account </span>
            <Link
              href={`/sign-up?app=${app}`}
              className="underline text-xs sm:text-sm font-bold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
