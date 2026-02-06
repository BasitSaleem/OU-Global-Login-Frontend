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
  passwordValidation("New password")
    .safeParse(newPassword).success;
  
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
    <>
      <main className="flex items-center justify-center px-6 pb-4 md:pt-1 pt-20">
        <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
          <div className="bg-bg-secondary rounded-2xl sm:rounded-[16px] px-4 sm:px-14 py-3 sm:py-4">
            <div className="text-center mb-3 mt-2 sm:mb-4">
              <h1 className="text-base sm:text-xl font-bold text-text">
                Reset Password
              </h1>
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-2 sm:space-y-3"
              >
                <Input
                  id="newPassword"
                  label="Enter New Password"
                  type="password"
                  placeholder="Enter New Password"
                  {...methods.register("newPassword", {
                    required: "New Password is required",
                  })}
                  isPassword={true}
                  error={
                    methods.formState.errors.newPassword?.message as string
                  }
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
                  error={
                    methods.formState.errors.confirmPassword?.message as string
                  }
                />
                <div className="flex items-center justify-center pt-1 sm:pt-2">
                  <Link
                    href="/login"
                    className="text-xs font-bold text-primary"
                  >
                    Back to Login
                  </Link>
                </div>

                <div className="pt-2 sm:pt-3 sm:mt-5">
                  <Button
                    type="submit"
                    isLoading={isPending}
                    disabled={
                      isPending ||
                      Object.keys(methods.formState.errors).length > 0
                    }
                    variant="primary"
                    className="w-full h-8 sm:h-9 text-white text-xs bg-primary hover:bg-primary/80 sm:text-sm font-bold rounded-full"
                  >
                    {!isPending ? "Reset Password" : "Resetting Password ..."}
                  </Button>
                </div>
              </form>
            </FormProvider>

            <div className="my-3 sm:my-7 flex items-center">
              <div className="flex-1 border-t border"></div>
              <span className="px-2 sm:px-3 text-xs sm:text-sm">Or</span>
              <div className="flex-1 border-t border"></div>
            </div>

            <div className="space-y-2 sm:space-y-5">
              <Button
                variant="primary"
                className="w-full border-primary/10 rounded-2xl bg-primary/0 hover:bg-primary/10 text-text hover:text-primary"
              >
                <Image src={Icons.google} alt="Google" width={20} height={20} />
                <span className="text-xs sm:text-sm ">
                  Continue with Google
                </span>
              </Button>
              <Button
                variant="primary"
                className="w-full border-primary/10 rounded-2xl bg-primary/0 hover:bg-primary/10 text-text hover:text-primary"
              >
                <Image
                  src={Icons.microsoft}
                  alt="Microsoft"
                  width={20}
                  height={20}
                />
                <span className="text-xs sm:text-sm ">
                  Continue with Microsoft
                </span>
              </Button>
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <span className="text-xs sm:text-sm">Don't have an account </span>
              <Link
                href={ROUTES.REGISTER}
                className="underline text-xs sm:text-sm font-bold text-primary hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
