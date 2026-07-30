"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSignUp } from "@/apiHooks.ts/auth/auth.api";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/auth.schemas";
import { Button, Input } from "@/components/ui";
import { signUpData } from "@/apiHooks.ts/auth/auth.types";
import GoogleButton from "@/components/ui/GoogleButton";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

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
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      } as signUpData,
      {
        onSuccess: (response) => {
          router.push(
            `/otp?email=${encodeURIComponent(response.data.email)}${token ? `&token=${token}` : ""}`,
          );
        },
      },
    );
  };

  return (
    <AuthPageShell>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign up to get started with Owners Universe.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="text"
              label="First Name"
              id="first_name"
              placeholder="Enter First Name"
              {...methods.register("first_name", {
                required: "first name is required",
              })}
              error={methods.formState.errors.first_name?.message as string}
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
            autoComplete="username"
            disabled={email && email.length > 0 ? true : false}
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
            autoComplete="new-password"
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
            autoComplete="new-password"
            {...methods.register("confirmPassword", {
              required: "confirm password is required",
            })}
            error={methods.formState.errors.confirmPassword?.message as string}
          />

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isPending}
              disabled={
                isPending || Object.keys(methods.formState.errors).length > 0
              }
              variant="primary"
              className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-xl cursor-pointer"
            >
              {isPending ? "Signing up .." : "Sign up"}
            </Button>
          </div>
        </form>
      </FormProvider>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border"></div>
        <span className="px-3 text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border"></div>
      </div>

      <GoogleButton text="Continue with Google" className="w-full rounded-xl" />
      <div className="mt-6 text-center">
        <span className="text-sm text-text">Already have an account? </span>
        <Link
          href={`/login?app=${app}`}
          className="text-sm font-bold text-text hover:underline"
        >
          Sign In
        </Link>
      </div>
    </AuthPageShell>
  );
}
