"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/schemas/auth.schemas";
import { useVerifyOtp, useResendOtp } from "@/apiHooks.ts/auth/auth.api";
import { useEffect, useState } from "react";
import { OTPInput } from "@/components/ui/otp-input";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/slices/auth.slice";
import logger from "@/utils/logger";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

function OTPPage() {
  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || undefined;
  const router = useRouter();
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const methods = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const otpValue = watch("otp");
  const onSubmit = async (data: any) => {
    verifyOtp(
      { email, otp: data.otp, token },
      {
        onSuccess: (response) => {
          const { user, refreshToken } = response.data;
          dispatch(
            setAuth({
              user,
              isAuthenticated: true,
              refreshToken,
              isLoading: false,
              error: null,
            }),
          );
          router.push("/create-organization");
        },
        onError: (error) => {
          logger.error("OTP verification failed:", error);
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (canResend && email) {
      resendOtp(
        { email },
        {
          onSuccess: (response) => {
            setCountdown(120);
            setCanResend(false);
          },
        },
      );
    }
  };

  const handleOtpChange = (otp: string) => {
    setValue("otp", otp, { shouldValidate: true });
  };

  return (
    <AuthPageShell>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-text">{email}</span>
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <OTPInput
            length={6}
            value={otpValue}
            onChange={handleOtpChange}
            error={methods.formState.errors.otp?.message as string}
          />

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isPending}
              disabled={isPending || otpValue.length !== 6}
              variant="primary"
              className="w-full h-[50px] text-white text-sm bg-gradient-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-full cursor-pointer"
            >
              {!isPending ? "Verify OTP" : "Verifying..."}
            </Button>
          </div>
        </form>
      </FormProvider>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Didn't receive the code?{" "}
          {canResend ? (
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="font-bold text-text underline hover:underline cursor-pointer disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <span className="text-gray-500">Resend in {countdown}s</span>
          )}
        </p>
      </div>

      <div className="mt-6 pt-6 border-t text-center">
        <button
          onClick={() => router.back()}
          className="text-sm font-bold text-text hover:underline cursor-pointer"
        >
          Back
        </button>
      </div>
    </AuthPageShell>
  );
}

export default OTPPage;
