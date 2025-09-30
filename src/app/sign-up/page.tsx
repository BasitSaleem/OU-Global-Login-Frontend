"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/utils/icons";
import Image from "next/image";
import { useSignUp } from "@/apiHooks.ts/auth/auth.api";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schems/auth.schemas";
import { Input, Logo } from "@/components/ui";
import { signUpData } from "@/apiHooks.ts/auth/auth.types";

export default function SignUpPage() {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const { handleSubmit } = methods;
  const { mutate: signUp, isPending, error } = useSignUp();


  // Handle app query param
    const searchParams = useSearchParams();
    const app = searchParams.get("app") || "OG"; // 👈 fallback to OG
  
    // Redirect to add default app param if missing
      useEffect(() => {
      const app = searchParams.get("app");
      if (!app) {
        // Redirect with default param
        router.replace("/sign-up?app=OG");
      }
    }, [router, searchParams]);


    // Form submission handler
  const onSubmit = async (data: signUpData) => {
    signUp(
      { first_name:data.first_name,last_name:data.last_name,email: data.email, password: data.password } as signUpData,
      {
        onSuccess: () => {
          router.push("/create-organization");
        },
      }
    );
    // Simple redirect to home page - no authentication logic for now
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative image */}
      <div className="absolute inset-0 opacity-40">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/7d84dae638c9d28ed83d25c88312020e516778bd?width=3660"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header with logo and sign in */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-4 lg:p-6">
        <Logo Icon={app === "OI" ? Icons.OI : Icons.owneruniverse} />
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-gray-700 hidden sm:block">
            Already have an account?
          </span>
          <Link
            href={`/login?app=${app}`}
            className="bg-[#795CF5] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex items-center justify-center px-6 sm:px-6 pb-4 sm:pb-6 pt-0 sm:pt-2">
        {/* Main sign up card */}
        <div className="relative z-10 w-full max-w-xs sm:max-w-md">
          <div className="bg-white rounded-2xl sm:rounded-[15px] shadow-[0_0_20px_0_rgba(0,0,0,0.06)] px-4 sm:px-14 py-3 sm:py-4">
            {/* Welcome heading */}
            <div className="text-center mb-3 mt-2 sm:mb-4">
              <h1 className="text-base sm:text-lg font-bold text-gray-900">
                Sign up to get started
              </h1>
            </div>
            <FormProvider {...methods}>
              {/* Sign up form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2 sm:space-y-3"
              >
                {/* Name fields row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  {/* First Name field */}
                  <Input
                    className="w-full h-8 sm:h-9 px-3 bg-gray-100 border-0 rounded-lg text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#795CF5] transition-all"
                    type="text"
                    label="First Name"
                    id="first_name"
                    placeholder="Enter First Name"
                    {...methods.register("first_name", {
                      required: "first name is required",
                    })}
                    error={
                      methods.formState.errors.first_name?.message as string
                    }
                  />
                  {/* Last Name field */}
                  <Input
                    className="w-full h-8 sm:h-9 px-3 bg-gray-100 border-0 rounded-lg text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#795CF5] transition-all"
                    type="text"
                    label="Last Name"
                    id="last_name"
                    placeholder="Enter Last Name"
                    {...methods.register("last_name", {
                      required: "last name is required",
                    })}
                    error={methods.formState.errors.last_name?.message as string}
                  />
                </div>

                {/* Email field */}
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

                {/* Password field */}
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
                <Input
                  className="w-full h-8 sm:h-9 px-3 bg-gray-100  border-0 rounded-lg text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#795CF5] transition-all"
                  id="confirmPassword"
                  label="Confirm Password"
                  type="confirmPassword"
                  placeholder="Confirm Password"
                  isPassword={true}
                  {...methods.register("confirmPassword", {
                    required: "confirm password is required",
                  })} // Register input
                  error={
                    methods.formState.errors.confirmPassword?.message as string
                  }
                />

                {/* Sign Up button */}
                <div className="pt-2 sm:pt-3 sm:mt-5">
                  <button
                    type="submit"
                    className="w-full h-8 sm:h-9 bg-[#795CF5] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
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

            {/* Social login buttons */}
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

            {/* Sign in link */}
            <div className="mt-3 sm:mt-4 text-center">
              <span className="text-xs sm:text-sm text-gray-900">
                Already have an account{" "}
              </span>
              <Link
                href={`/login?app=${app}`}
                className="text-xs sm:text-sm font-bold text-[#795CF5] hover:underline underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center relative z-10 pb-2 sm:pb-0">
        <p className="text-xs text-gray-700">
          ©2025 Owners Inventory - All rights reserved
        </p>
      </div>
    </div>
  );
}
