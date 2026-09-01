"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Dots, Input } from "@/components/ui";
import { useEffect } from "react";
import { useValidateAcceptEmailToken } from "@/apiHooks.ts/auth/auth.api";
import { AlertCircle } from "lucide-react";
import { useVerifyPassword } from "@/apiHooks.ts/auth/auth.api";
import { useSendOtpForChangeEmail } from "@/apiHooks.ts/auth/auth.api";
import logger from "@/utils/logger";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

interface EmailChangeData {
  userId: string;
  exp: number;
  iat: number;
  email: string;
  newEmail: string;
}

export default function AcceptEmailChangePage() {
  // const { onSubmit, isPending, error: loginError } = useAuthContext();
  const { mutate: sendOtpForChangeEmail, isPending: isSendingOtp } =
    useSendOtpForChangeEmail();
  const { mutate: verifyPassword, isPending: isVerifyingPassword } =
    useVerifyPassword();
  const {
    mutate: validateToken,
    isPending: isValidating,
    data: tokenResponse,
  } = useValidateAcceptEmailToken();
  const searchParams = useSearchParams();
  const token = searchParams.get("change_email_token") || undefined;
  const tokenData = tokenResponse?.data as EmailChangeData | undefined;
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    if (token) {
      validateToken({ token });
    }
  }, [token, validateToken]);

  useEffect(() => {
    if (tokenData?.email) {
      setValue("email", tokenData.email);
    }
  }, [tokenData, setValue]);

  const handleFormSubmit = (formData: { email: string; password: string }) => {
    verifyPassword(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => {
          sendOtpForChangeEmail(
            { token: token! },
            {
              onSuccess: () => {
                router.push(`/verify-change-email-otp?token=${token}`);
              },
            },
          );
        },
        onError: (error) => {
          logger.log(error);
        },
      },
    );
  };

  if (isValidating) {
    return (
      <AuthPageShell>
        <div className="flex flex-col items-center justify-center w-full">
          <Dots />
          <p className="mt-4 text-gray-500 animate-pulse text-sm font-medium">
            Validating your request...
          </p>
        </div>
      </AuthPageShell>
    );
  }

  if (!tokenData && !isValidating && token) {
    return (
      <AuthPageShell>
        <div className="text-center">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-text mb-3">
            Invalid or Expired Link
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            This email change link is either invalid or has expired. Please
            request a new email change from your profile settings.
          </p>
          <Button
            variant="primary"
            className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-full"
            onClick={() => (window.location.href = "/login")}
          >
            Back to Login
          </Button>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          Verify Email Change
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Please confirm your identity to complete the change
        </p>
      </div>

      <div className="rounded-2xl p-5 mb-8 border border-border bg-black/2">
        <p className="font-semibold text-center">from</p>
        <div className="flex-col items-center justify-between ">
          <p className="text-sm font-semibold text-center text-text">
            {tokenData?.email || "..."}
          </p>
          <p className=" font-semibold text-center ">to</p>
          <p className="text-sm font-bold truncate text-center text-primary">
            {tokenData?.newEmail || "..."}
          </p>
        </div>
        <p className="text-sm font-semibold text-center text-text mt-2">
          Please click on the button below to request an OTP to confirm the
          change
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <Input
            id="email"
            label="Confirm Current Email"
            type="email"
            disabled
            {...methods.register("email")}
          />

          <Input
            id="password"
            label="Your Password"
            type="password"
            placeholder="Enter password to confirm"
            isPassword={true}
            {...methods.register("password", {
              required: "Password is required to confirm change",
            })}
            error={methods.formState.errors.password?.message as string}
          />
          <Button
            type="submit"
            isLoading={isVerifyingPassword}
            disabled={
              isVerifyingPassword ||
              Object.keys(methods.formState.errors).length > 0
            }
            variant="primary"
            className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-xl mt-2"
          >
            {!isVerifyingPassword ? "Request OTP" : "Requesting OTP..."}
          </Button>
        </form>
      </FormProvider>
    </AuthPageShell>
  );
}
