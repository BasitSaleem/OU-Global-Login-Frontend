"use client";
import React from "react";
import { Icons } from "@/components/utils/icons";
import Image from "next/image";
import { ROUTES } from "@/constants";
import { useSearchParams } from "next/navigation";
import { FormProvider, useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schemas/auth.schemas";
import { resetPasswordData } from "@/types/auth.types";
import { useResetPassword } from "@/apiHooks.ts/auth/auth.api";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";
import { passwordValidation } from "@/schemas/password.schema";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const token = searchParams.get("token");
  const methods = useForm<any>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = useWatch({
    control: methods.control,
    name: "newPassword",
  });

  const isNewPasswordValid =
    passwordValidation("New password").safeParse(newPassword).success;

  const isConfirmDisabled = !isNewPasswordValid;

  const { handleSubmit } = methods;
  const handleFormSubmit = (data: resetPasswordData) => {
    resetPassword(data, {
      onSuccess: () => {
        methods.reset();
        router.push(ROUTES.LOGIN);
      },
    });
  };

  return (
    <AuthPageShell>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Choose a new password for your account.
        </p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <Input
            id="newPassword"
            label="Enter New Password"
            type="password"
            placeholder="Enter New Password"
            {...methods.register("newPassword", {
              required: "New Password is required",
            })}
            isPassword={true}
            error={methods.formState.errors.newPassword?.message as string}
          />
          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            isPassword={true}
            disabled={isConfirmDisabled}
            placeholder="Confirm New Password"
            {...methods.register("confirmPassword", {
              required: "Confirm Password is required",
            })}
            error={methods.formState.errors.confirmPassword?.message as string}
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
              {!isPending ? "Reset Password" : "Resetting Password"}
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
        <Button
          variant="primary"
          className="w-full border-primary/10 rounded-xl bg-primary/0 hover:bg-primary/10 text-text hover:text-primary"
        >
          <Image src={Icons.google} alt="Google" width={20} height={20} />
          <span className="text-xs sm:text-sm ">Continue with Google</span>
        </Button>
        <Button
          variant="primary"
          className="w-full border-primary/10 rounded-xl bg-primary/0 hover:bg-primary/10 text-text hover:text-primary"
        >
          <Image src={Icons.microsoft} alt="Microsoft" width={20} height={20} />
          <span className="text-xs sm:text-sm ">Continue with Microsoft</span>
        </Button>
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
};

export default page;
