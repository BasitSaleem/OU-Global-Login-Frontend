"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { Icons } from "@/components/utils/icons";
import { Button, Input, Logo } from "@/components/ui";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schems/auth.schemas";
import { useLogin } from "@/apiHooks.ts/auth/authApi.hooks";
import { useEffect } from "react";
export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const searchParams = useSearchParams();
  const app = searchParams.get("app") || "OG"; // 👈 fallback to OG
  console.log("App from query params:", app); // Debugging line
    const router = useRouter();


    useEffect(() => {
    const app = searchParams.get("app");
    if (!app) {
      // Redirect with default param
      router.replace("/login?app=OG");
    }
  }, [router, searchParams]);

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    login(data, {
      onSuccess: () => {
        router.push("/");
      },
    });
    // router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/c50393b05848b5d4a774880c9a82dc541689594f?width=3660"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <Logo Icon={app === "OI" ? Icons.OI : Icons.owneruniverse} />
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-gray-700 hidden sm:block">
            Don't have an account?
          </span>
          <Link
            href={`/sign-up?app=${app}`}
            className="bg-[#795CF5] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 h-[450px] sm:h-full sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
        <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
          <div className="bg-white rounded-2xl sm:rounded-[16px] shadow-[0_0_20px_0_rgba(0,0,0,0.06)] px-4 sm:px-14 py-3 sm:py-4">
            <div className="text-center mb-3 mt-2 sm:mb-4">
              <h1 className="text-base sm:text-xl font-bold text-gray-900">
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
                  className="w-full h-8 sm:h-9 px-3 bg-gray-100 border-0 rounded-lg text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#795CF5] transition-all"
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
                  className="w-full h-8 sm:h-9 px-3 bg-gray-100  border-0 rounded-lg text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#795CF5] transition-all"
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
                      className="w-3 h-3 sm:w-4 sm:h-4 appearance-none border border-gray-400 rounded checked:bg-[#795CF5] focus:ring-1 focus:ring-[#795CF5] cursor-pointer"
                    />
                    <span className="text-xs text-gray-900 font-semibold">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#795CF5] underline hover:underline"
                  >
                    Forget Password?
                  </Link>
                </div>

                <div className="pt-2 sm:pt-3 sm:mt-5">
                  <Button
                    type="submit"
                    isLoading={isPending}
                    disabled={isPending}
                    variant="primary"
                    className="w-full h-8 sm:h-9 dark:bg-[#795CF5] dark:hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer"
                  >
                    {!isPending ? "Sign In" : "Signing in ..."}
                  </Button>
                </div>
              </form>
            </FormProvider>

            {/* Divider */}
            <div className="my-3 sm:my-7 flex items-center">
              <div className="flex-1 border-t border-[#C9C8CD]"></div>
              <span className="px-2 sm:px-3 text-xs sm:text-sm text-gray-900">
                Or
              </span>
              <div className="flex-1 border-t border-[#C9C8CD]"></div>
            </div>

            <div className="space-y-2 sm:space-y-5">
              <button className="cursor-pointer w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 border border-[#C9C8CD] rounded-full hover:bg-gray-50 transition-colors">
                <Image src={Icons.google} alt="Google" width={20} height={20} />
                <span className="text-xs sm:text-sm text-gray-900">
                  Continue with Google
                </span>
              </button>
              <button className="cursor-pointer w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 border border-[#C9C8CD] rounded-full hover:bg-gray-50 transition-colors">
                <Image
                  src={Icons.microsoft}
                  alt="Microsoft"
                  width={20}
                  height={20}
                />
                <span className="text-xs sm:text-sm text-gray-900">
                  Continue with Microsoft
                </span>
              </button>
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <span className="text-xs sm:text-sm text-gray-900">
                Don't have an account{" "}
              </span>
              <Link
                href={`/sign-up?app=${app}`}
                className="underline text-xs sm:text-sm font-bold text-[#795CF5] hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center relative z-10 pb-2 sm:pb-4">
        <p className="text-sm text-gray-700">
          ©2025 Owners Inventory - All rights reserved
        </p>
      </div>
    </div>
  );
}
