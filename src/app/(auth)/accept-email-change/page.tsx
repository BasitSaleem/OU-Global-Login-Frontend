"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Dots, Input } from "@/components/ui";
import { useEffect } from "react";
import { useValidateAcceptEmailToken } from "@/apiHooks.ts/auth/auth.api";
import { AlertCircle } from "lucide-react";
import { useVerifyPassword } from "@/apiHooks.ts/auth/auth.api";
import { useSendOtpForChangeEmail } from "@/apiHooks.ts/auth/auth.api";

interface EmailChangeData {
    userId: string;
    exp: number;
    iat: number;
    email: string;
    newEmail: string;
}

export default function AcceptEmailChangePage() {
    // const { onSubmit, isPending, error: loginError } = useAuthContext();
    const { mutate: sendOtpForChangeEmail, isPending: isSendingOtp } = useSendOtpForChangeEmail();
    const { mutate: verifyPassword, isPending: isVerifyingPassword } = useVerifyPassword();
    const { mutate: validateToken, isPending: isValidating, data: tokenResponse } = useValidateAcceptEmailToken();
    const searchParams = useSearchParams();
    const token = searchParams.get('change_email_token') || undefined;
    const tokenData = tokenResponse?.data as EmailChangeData | undefined;
    const router = useRouter();
    const methods = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange"
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
        verifyPassword({ email: formData.email, password: formData.password }, {
            onSuccess: () => {
                sendOtpForChangeEmail({ token: token! }, {
                    onSuccess: () => {
                        router.push(`/verify-change-email-otp?token=${token}`)
                    }
                });
            },
            onError: (error) => {
                console.log(error);
            }
        });
    }

    if (isValidating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <Dots />
                <p className="mt-4 text-text-secondary animate-pulse text-sm font-medium">Validating your request...</p>
            </div>
        );
    }

    if (!tokenData && !isValidating && token) {
        return (
            <main className="flex items-center justify-center px-6 pb-4 md:pt-1 pt-20">
                <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md text-center">
                    <div className="bg-bg-secondary rounded-2xl p-8 border border-red-100 shadow-sm">
                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-xl font-bold text-text mb-3">Invalid or Expired Link</h1>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6">
                            This email change link is either invalid or has expired. Please request a new email change from your profile settings.
                        </p>
                        <Button
                            variant="primary"
                            className="w-full rounded-xl"
                            onClick={() => window.location.href = '/login'}
                        >
                            Back to Login
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex items-center justify-center px-6 pb-4 md:pt-1 pt-20">
            <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
                <div className="bg-bg-secondary rounded-2xl sm:rounded-[24px] px-6 sm:px-10 py-8 sm:py-10 border border-border/40">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                            Verify Email Change
                        </h1>
                        <p className="text-text-secondary text-sm mt-2 font-medium">
                            Please confirm your identity to complete the change
                        </p>
                    </div>

                    <div className="bg-bg-primary/40   rounded-[20px] p-5 mb-8 border border-border/30 backdrop-blur-sm">
                        <p className="font-semibold text-center">from</p>
                        <div className="flex-col items-center justify-between ">
                            <p className="text-sm font-semibold text-center text-text">{tokenData?.email || "..."}</p>
                            <p className=" font-semibold text-center ">to</p>
                            <p className="text-sm font-bold truncate text-center text-primary">{tokenData?.newEmail || "..."}</p>
                        </div>
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
                                disabled={isVerifyingPassword || Object.keys(methods.formState.errors).length > 0}
                                variant="primary"
                                className="w-full h-12 text-white text-sm bg-primary hover:bg-primary/90 font-bold rounded-2xl transition-all active:scale-[0.98] mt-2"
                            >
                                {!isVerifyingPassword ? "Update Email Address" : "Updating..."}
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </main>
    );
}
