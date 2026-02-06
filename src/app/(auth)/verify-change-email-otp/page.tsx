"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/schemas/auth.schemas";
import { useChangeEmailFinal, useSendOtpForChangeEmail } from "@/apiHooks.ts/auth/auth.api";
import { OTPInput } from "@/components/ui/otp-input";
import { ArrowLeft, Mail } from "lucide-react";
import { ROUTES } from "@/constants";
import { useEffect, useState } from "react";

export default function VerifyChangeEmailOTPPage() {
    const { mutate: changeEmail, isPending: isVerifying } = useChangeEmailFinal();
    const { mutate: resendOtp, isPending: isResending } = useSendOtpForChangeEmail();
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
                }
            );
        }
    };

    const methods = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
        mode: "onChange"
    });

    const { handleSubmit, watch, setValue, formState: { errors } } = methods;
    const otpValue = watch("otp");

    const onSubmit = async (data: { otp: string }) => {
        if (!token) return;

        changeEmail(
            { token, otp: data.otp },
            {
                onSuccess: () => {
                    router.push(ROUTES.LOGIN);
                },
                onError: (error) => {
                    console.error("Email change failed:", error);
                },
            }
        );
    };

    const handleOtpChange = (otp: string) => {
        setValue("otp", otp, { shouldValidate: true });
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] px-6">
                <div className="text-center space-y-4 bg-bg-secondary p-8 rounded-3xl border border-red-100 shadow-sm max-w-sm w-full">
                    <p className="text-red-500 font-bold text-lg">Invalid Session</p>
                    <p className="text-text-secondary text-sm">Please restart the email change process from your settings.</p>
                    <Button onClick={() => router.push(ROUTES.LOGIN)} variant="primary" className="w-full rounded-2xl">
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <main className="flex items-center justify-center px-6 pb-4 md:pt-1 pt-20">
            <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
                <div className="bg-bg-secondary rounded-[24px] sm:rounded-[32px] px-6 sm:px-12 py-10 sm:py-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-primary/10 mb-8 transform hover:scale-105 transition-transform duration-300">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight mb-3">
                            Check Your Email
                        </h1>
                        <p className="text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                            We've sent a 6-digit confirmation code to your new email address.
                        </p>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-col items-center">
                                <OTPInput
                                    length={6}
                                    value={otpValue}
                                    onChange={handleOtpChange}
                                    error={errors.otp?.message as string}
                                />
                                <div className="mt-6 text-center">
                                    <p className="text-sm font-medium text-text-secondary">
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
                                    className="w-full h-14 text-white text-base bg-primary hover:bg-primary/90 font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] border-none"
                                >
                                    {!isVerifying ? "Confirm Email Change" : "Finalizing Change..."}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-text-secondary hover:text-text transition-all duration-200 group"
                                >
                                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                                    <span>Back to previous step</span>
                                </button>
                            </div>
                        </form>
                    </FormProvider>

                    <div className="mt-10 pt-8 border-t border-border/10 text-center">
                        <p className="text-[11px] text-text-secondary/50 font-medium italic">
                            Email will be updated immediately upon successful verification
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
