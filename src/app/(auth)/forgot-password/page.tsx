"use client";

import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { Icons } from "@/components/utils/icons";
import { Button, Input } from "@/components/ui";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schemas/auth.schemas";
import { useForgotPassword } from "@/apiHooks.ts/auth/auth.api";
import { forgotPasswordData } from "@/types/auth.types";
import { ROUTES } from "@/constants";
import { useRouter } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import GoogleButton from "@/components/ui/GoogleButton";

export default function ForgotPasswordPage() {
  const { mutate: changePassword, isPending } = useForgotPassword();
  const router = useRouter();
  const methods = useForm<forgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit } = methods;
  const handleFormSubmit = (formData: forgotPasswordData) => {
    changePassword(formData, {
      onSuccess: () => {
        router.push(ROUTES.LOGIN);
      },
      onError: (error) => {
        router.push(ROUTES.LOGIN);
      },
    });
  };
  return (
    <AuthPageShell>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          Forgot password
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <Input
            id="email"
            label="Enter Email Address"
            type="email"
            placeholder="you@company.com"
            {...methods.register("email", {
              required: "Email is required",
            })}
            error={methods.formState.errors.email?.message as string}
          />

          <div className="flex items-center justify-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-text hover:text-primary hover:underline"
            >
              Back to Login
            </Link>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isPending}
              disabled={
                isPending || Object.keys(methods.formState.errors).length > 0
              }
              variant="primary"
              className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-xl"
            >
              {!isPending ? "Send Reset Link" : "Sending Reset Link ..."}
            </Button>
          </div>
        </form>
      </FormProvider>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border"></div>
        <span className="px-3 text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border"></div>
      </div>

      <div className="space-y-3">
        <GoogleButton
          text="Continue with Google"
          className="flex rounded-xl border-primary/10 bg-primary/0 hover:bg-primary/10 text-text hover:text-primary"
        />
        {/* <Button
          variant="primary"
          className="w-full rounded-xl border-primary/10 bg-primary/0 hover:bg-primary/10 text-text hover:text-primary"
        >
          <Image src={Icons.google} alt="Google" width={20} height={20} />
          <span className="text-xs sm:text-sm ">Continue with Google</span>
        </Button> */}
        {/* <Button
          variant="primary"
          className="w-full border-primary/10 rounded-xl bg-primary/0 hover:bg-primary/10 text-text hover:text-primary"
        >
          <Image src={Icons.microsoft} alt="Microsoft" width={20} height={20} />
          <span className="text-xs sm:text-sm ">Continue with Microsoft</span>
        </Button> */}
      </div>

      <div className="mt-6 text-center">
        <span className="text-sm text-text">Don't have an account? </span>
        <Link
          href={ROUTES.REGISTER}
          className="text-sm font-bold text-text hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </AuthPageShell>
  );
}
