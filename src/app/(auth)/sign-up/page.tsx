"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/utils/icons";
import Image from "next/image";
import { useSignUp } from "@/apiHooks.ts/auth/auth.api";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/auth.schemas";
import { Button, Input, } from "@/components/ui";
import { signUpData } from "@/apiHooks.ts/auth/auth.types";

export default function SignUpPage() {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const { handleSubmit } = methods;
  const { mutate: signUp, isPending, error } = useSignUp();
  const token = useSearchParams().get("token");
  const email = useSearchParams().get("email");
  const searchParams = useSearchParams();
  const app = searchParams.get("app") || "OG";

  useEffect(() => {
    const app = searchParams.get("app");
    if (!app) {
      router.replace("/sign-up?app=OG");
    }
  }, [router, searchParams]);
  useEffect(() => {
    if (email) {
      methods.setValue("email", email);
    }
  }, [email, methods]);
  const onSubmit = async (data: signUpData) => {
    signUp(
      { first_name: data.first_name, last_name: data.last_name, email: data.email, password: data.password } as signUpData,
      {
        onSuccess: (response) => {
          // const { user, refreshToken, } = response.data;
          // const organization = user.organizations?.[0] ?? null;
          // dispatch(
          //   setAuth({
          //     user,
          //     organization,
          //     isAuthenticated: true,
          //     refreshToken,
          //     isLoading: false,
          //     error: null,
          //   })
          // );
          router.push(`/otp?email=${encodeURIComponent(response.data.email)}${token ? `&token=${token}` : ""}`);
        },
      }
    );
  };

  return (

    <>    {/* Main content container */}
      < div className="flex items-center justify-center px-6 sm:px-6 pb-4 sm:pb-6 pt-0 sm:pt-2" >
        {/* Main sign up card */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
          <div className="bg-bg-secondary rounded-2xl sm:rounded-[16px] px-4 sm:px-14 py-3 sm:py-4">
            {/* Welcome heading */}
            <div className="text-center mb-3 mt-2 sm:mb-4">
              <h1 className="text-base sm:text-lg font-bold text-text">
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
                  <Input
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
                  placeholder="Enter Password"
                  isPassword={true}
                  {...methods.register("password", {
                    required: "Password is required",
                  })}
                  error={methods.formState.errors.password?.message as string}
                />
                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm Password"
                  isPassword={true}
                  {...methods.register("confirmPassword", {
                    required: "confirm password is required",
                  })}
                  error={
                    methods.formState.errors.confirmPassword?.message as string
                  }
                />

                {/* Sign Up button */}
                <div className="pt-2 sm:pt-3 sm:mt-5">
                  <Button
                    type="submit"
                    isLoading={isPending}
                    disabled={isPending || Object.keys(methods.formState.errors).length > 0}
                    variant="primary"
                    className="w-full h-8 sm:h-9 text-white text-xs bg-[#947AF6] hover:bg-[#947AF6]/80 sm:text-sm font-bold rounded-full  cursor-pointer"

                  >
                    {isPending ? "Signing up .." : "Sign up"}
                  </Button>
                </div>
              </form>
            </FormProvider>
            {/* Divider */}
            <div className="my-3 sm:my-7 flex items-center">
              <div className="flex-1 border-t "></div>
              <span className="px-2 sm:px-3 text-xs sm:text-sm">
                Or
              </span>
              <div className="flex-1 border-t"></div>
            </div>

            {/* Social login buttons */}
            <div className="space-y-2 sm:space-y-5">
              <button className="cursor-pointer hover:text-btn-text w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 border  rounded-full hover:bg-primary/80 transition-colors">
                <Image src={Icons.google} alt="Google" width={20} height={20} />
                <span className="text-xs sm:text-sm">
                  Continue with Google
                </span>
              </button>
              <button className="cursor-pointer hover:text-btn-text w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 border  rounded-full hover:bg-primary/80 transition-colors">
                <Image
                  src={Icons.microsoft}
                  alt="Microsoft"
                  width={20}
                  height={20}
                />
                <span className="text-xs sm:text-sm">
                  Continue with Microsoft
                </span>
              </button>
            </div>

            {/* Sign in link */}
            <div className="mt-3 sm:mt-4 text-center">
              <span className="text-xs sm:text-sm">
                Already have an account{" "}
              </span>
              <Link
                href={`/login?app=${app}`}
                className="text-xs sm:text-sm font-bold text-primary hover:underline underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div >
      </div >

    </>

  );
}
