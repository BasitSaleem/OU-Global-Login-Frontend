"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Logo } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/schemas/auth.schemas";
import { useVerifyOtp, useResendOtp } from "@/apiHooks.ts/auth/auth.api";
import { useEffect, useState } from "react";
import { OTPInput } from "@/components/ui/otp-input";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/slices/auth.slice";
export default function OTPPage() {
  const { mutate: verifyOtp, isPending, error } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useDispatch()
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
      { email, otp: data.otp },
      {
        onSuccess: (response) => {
          const { user, refreshToken } = response.data
          const organization = null;
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
        },
        onError: (error) => {
          console.error("OTP verification failed:", error);
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (canResend && email) {
      resendOtp(
        { email },
        {
          onSuccess: (response) => {

            setCountdown(60);
            setCanResend(false);

          },
        }
      );
    }
  };

  const handleOtpChange = (otp: string) => {
    setValue("otp", otp, { shouldValidate: true });
  };

  return (
    <div className="flex items-center justify-center px-6 h-[450px]  pb-4 pt-64 ">
      <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
        <div className="bg-bg-secondary rounded-2xl sm:rounded-[16px] px-4 sm:px-14 py-3 sm:py-4">
          <div className="text-center mb-3 mt-2 sm:mb-4">
            <h1 className="text-base sm:text-xl font-bold text-text">
              Verify your email
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold">{email}</span>
            </p>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2 sm:space-y-3"
            >
              <OTPInput
                length={6}
                value={otpValue}
                onChange={handleOtpChange}
                error={methods.formState.errors.otp?.message as string}
              />

              <div className="pt-2 sm:pt-3 sm:mt-5">
                <Button
                  type="submit"
                  isLoading={isPending}
                  disabled={isPending || otpValue.length !== 6}
                  variant="primary"
                  className="w-full h-8 sm:h-9 text-white text-xs sm:text-sm font-bold rounded-full cursor-pointer"
                >
                  {!isPending ? "Verify OTP" : "Verifying..."}
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm">
              Didn't receive the code?{" "}
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="font-bold text-primary underline hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </button>
              ) : (
                <span className="text-gray-500">
                  Resend in {countdown}s
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 border-t  text-center">
            <button
              onClick={() => router.back()}
              className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}