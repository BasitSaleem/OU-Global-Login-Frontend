"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { Icons } from "@/components/utils/icons";
import { Button, Input, Logo } from "@/components/ui";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schems/auth.schemas";
import { useLogin } from "@/apiHooks.ts/auth/auth.api";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { setAuth } from "@/redux/slices/auth.slice";
import { PublicRoute } from "@/components/guards/publicRoute.guard";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const searchParams = useSearchParams();
  const app = searchParams.get("app") || "OG";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [params, setParams] = useState<any>({});
  useEffect(() => {
    const app = searchParams.get("app");
    if(searchParams.get('client_id') !== '') {
      const data = {
        client_id: searchParams.get('client_id'),
        redirect_uri: searchParams.get('redirect_uri'),
        scope: searchParams.get('scope'),
        state: searchParams.get('state'),
        nonce: searchParams.get('nonce'),
        response_type: searchParams.get('response_type'),
        code_challenge: searchParams.get('code_challenge'),
        code_challenge_method: searchParams.get('code_challenge_method'),
        subdomain: searchParams.get('subdomain')
      }
      setParams(data);
    }
    if (!app) {
      router.replace("/login?app=OG");
    }
  }, [router, searchParams]);

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { handleSubmit } = methods;

  const createOnSubmitData = (formData: any) => {
    const data = {
      ...formData,
      ...params,
    }

    console.log('Data Sending: ', data);

    return data;
  }

  const onSubmit = async (data: any) => {
    login(createOnSubmitData(data), {
      onSuccess: (response) => {
        const { user, accessToken, refreshToken, redirect_url } = response.data;
        const organization = user.organizations?.[0] ?? null;

        dispatch(
          setAuth({
            user,
            organization,
            isAuthenticated: true,
            refreshToken,
            isLoading: false,
            error: null,
          })
        );

        setParams(redirect_url);
      },
    });
  };


  return (
    <PublicRoute redirectTo={typeof params === 'string' && params.length > 0 ? params : "/"}>
      <ThemeToggle/>
      <div className="min-h-screen bg-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
        </div>
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <Logo Icon={app === "OI" ? Icons.OI : Icons.owneruniverse} />
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm  hidden sm:block">
              Don't have an account?
            </span>
            <Link
              href={`/sign-up?app=${app}`}
              className="bg-primary hover:bg-[#7C3AED] text-btn-text text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 h-[450px] sm:h-full sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
          <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
            <div className="bg-bg-secondary rounded-2xl sm:rounded-[16px] px-4 sm:px-14 py-3 sm:py-4">
              <div className="text-center mb-3 mt-2 sm:mb-4">
                <h1 className="text-base sm:text-xl font-bold text-text">
                  Welcome back
                </h1>
              </div>
              <FormProvider {...methods}>
                {" "}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-2 sm:space-y-3"
                >
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Enter Email"
                    {...methods.register("email", {
                      required: "Email is required",
                    })}
                    error={methods.formState.errors.email?.message as string}
                  />

                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter Password"
                    isPassword={true}
                    {...methods.register("password", {
                      required: "Password is required",
                    })} // Register input
                    error={methods.formState.errors.password?.message as string}
                  />

                  <div className="flex items-center justify-between pt-1 sm:pt-2">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        {...methods.register("rememberMe")}
                        className="w-3 h-3 sm:w-4 sm:h-4 border bg-primary rounded  focus:ring-primary cursor-pointer"
                      />
                      <span className="text-xs font-semibold">
                        Remember me
                      </span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-primary underline hover:underline"
                    >
                      Forget Password?
                    </Link>
                  </div>

                  <div className="pt-2 sm:pt-3 sm:mt-5">
                    <Button
                      type="submit"
                      isLoading={isPending}
                      disabled={isPending || Object.keys(methods.formState.errors).length > 0}
                      variant="primary"
                      className="w-full h-8 sm:h-9 text-white text-xs sm:text-sm font-bold rounded-full  cursor-pointer"
                    >
                      {!isPending ? "Sign In" : "Signing in ..."}
                    </Button>
                  </div>
                </form>
              </FormProvider>

              {/* Divider */}
              <div className="my-3 sm:my-7 flex items-center">
                <div className="flex-1 border-t border"></div>
                <span className="px-2 sm:px-3 text-xs sm:text-sm">
                  Or
                </span>
                <div className="flex-1 border-t border"></div>
              </div>

              <div className="space-y-2 sm:space-y-5">
                <button className="cursor-pointer hover:text-btn-text w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 border  rounded-full hover:bg-primary/80 transition-colors">
                  <Image src={Icons.google} alt="Google" width={20} height={20} />
                  <span className="text-xs sm:text-sm ">
                    Continue with Google
                  </span>
                </button>
                <button className="cursor-pointer hover:text-btn-text w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 border rounded-full hover:bg-primary/80 transition-colors">
                  <Image
                    src={Icons.microsoft}
                    alt="Microsoft"
                    width={20}
                    height={20}
                  />
                  <span className="text-xs sm:text-sm ">
                    Continue with Microsoft
                  </span>
                </button>
              </div>

              <div className="mt-3 sm:mt-4 text-center">
                <span className="text-xs sm:text-sm">
                  Don't have an account{" "}
                </span>
                <Link
                  href={`/sign-up?app=${app}`}
                  className="underline text-xs sm:text-sm font-bold text-primary hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center relative z-10 pb-2 sm:pb-4">
          <p className="text-sm text-text">
            ©2025 Owners Inventory - All rights reserved
          </p>
        </div>
      </div>
    </PublicRoute>
  );
}
