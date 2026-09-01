"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { Checkbox } from "@/components/ui/Checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth.schemas";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";
import GoogleButton from "@/components/ui/GoogleButton";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function LoginPage() {
  const { onSubmit, isPending } = useAuthContext();
  const searchParams = useSearchParams();
  const app = searchParams.get("app") || "OG";
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const checkCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(event.getModifierState("CapsLock"));
  };

  const token = searchParams.get("token") || undefined;
  const emailParam = searchParams.get("email") || undefined;

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailParam || "",
      password: "",
      rememberMe: false,
    },
  });

  const { handleSubmit } = methods;

  const handleFormSubmit = (formData: any) => {
    onSubmit({ ...formData, token });
  };

  return (
    <AuthPageShell>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to access your Owners Universe products.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <Input
            id="email"
            label="Email"
            type="email"
            disabled={!!emailParam}
            placeholder="you@company.com"
            {...methods.register("email", {
              required: "Email is required",
            })}
            error={methods.formState.errors.email?.message as string}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            isPassword={true}
            {...methods.register("password", {
              required: "Password is required",
            })}
            onKeyUp={checkCapsLock}
            error={methods.formState.errors.password?.message as string}
          />

          {isCapsLockOn && (
            <div className="flex items-center gap-2 text-text text-[10px] sm:text-xs font-medium bg-yellow-50 p-2 rounded-md border border-yellow-200 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>Caps lock is on</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Checkbox {...methods.register("rememberMe")} label="Remember me" />
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-text hover:text-primary hover:underline"
            >
              Forgot password?
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
              {!isPending ? "Sign In" : "Signing in ..."}
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
        <span className="text-sm text-text">Don't have an account? </span>
        <Link
          href={`/sign-up?app=${app}`}
          className="text-sm font-bold text-text hover:underline"
        >
          Create one
        </Link>
      </div>
    </AuthPageShell>
  );
}
