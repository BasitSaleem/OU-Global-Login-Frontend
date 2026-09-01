"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/schemas/auth.schemas";
import {
  useChangeEmailFinal,
  useLogout,
  useSendOtpForChangeEmail,
} from "@/apiHooks.ts/auth/auth.api";
import { OTPInput } from "@/components/ui/otp-input";
import { ArrowLeft, Mail } from "lucide-react";
import { ROUTES } from "@/constants";
import { useEffect, useState } from "react";
import { clearAuth } from "@/redux/slices/auth.slice";
import { useAppDispatch } from "@/redux/store";
import { toast } from "@/hooks/useToast";
import logger from "@/utils/logger";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function VerifyChangeEmailOTPPage() {
  const { mutate: logout, isPending } = useLogout();
  const dispatch = useAppDispatch();
  const { mutate: changeEmail, isPending: isVerifying } = useChangeEmailFinal();
  const { mutate: resendOtp, isPending: isResending } =
    useSendOtpForChangeEmail();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendOtp = () => {
    if (canResend && token) {
      resendOtp(
        { token },
        {
          onSuccess: () => {
            setCountdown(60);
            setCanResend(false);
          },
        },
      );
    }
  };

  const methods = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const otpValue = watch("otp");

  const onSubmit = async (data: { otp: string }) => {
    if (!token) return;

    changeEmail(
      { token, otp: data.otp },
      {
        onSuccess: () => {
          logout(undefined, {
            onSuccess: () => {
              dispatch(clearAuth());
              toast.success(
                "Email changed successfully",
                "Please login with new email",
              );
              router.push(ROUTES.LOGIN);
            },
          });
        },
        onError: (error) => {
          logger.error("Email change failed:", error);
        },
      },
    );
  };

  const handleOtpChange = (otp: string) => {
    setValue("otp", otp, { shouldValidate: true });
  };

  if (!token) {
    return (
      <AuthPageShell>
        <div className="text-center space-y-4">
          <p className="text-red-500 font-bold text-lg">Invalid Session</p>
          <p className="text-gray-500 text-sm">
            Please restart the email change process from your settings.
          </p>
          <Button
            onClick={() => router.push(ROUTES.LOGIN)}
            variant="primary"
            className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-full"
          >
            Back to Login
          </Button>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-primary/10 mb-8 transform hover:scale-105 transition-transform duration-300">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight mb-3">
          Check Your Email
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-70 mx-auto">
          We've sent a 6-digit confirmation code to your new email address.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col items-end">
            <OTPInput
              length={6}
              value={otpValue}
              onChange={handleOtpChange}
              error={errors.otp?.message as string}
            />
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-gray-500">
                Didn't receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-primary font-bold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend Code"}
                  </button>
                ) : (
                  <span className="text-primary font-bold">
                    Resend in {countdown}s
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              isLoading={isVerifying}
              disabled={isVerifying || otpValue.length !== 6}
              variant="primary"
              className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 font-bold rounded-xl border-none"
            >
              {!isVerifying ? "Confirm Email Change" : "Finalizing Change..."}
            </Button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-500 hover:text-text transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to previous step</span>
            </button>
          </div>
        </form>
      </FormProvider>

      <div className="mt-10 pt-8 border-t border-border text-center">
        <p className="text-[11px] text-gray-500 font-medium italic">
          Email will be updated immediately upon successful verification
        </p>
      </div>
    </AuthPageShell>
  );
}
