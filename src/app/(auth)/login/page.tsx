"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { Icons } from "@/components/utils/icons";
import { Button, Input } from "@/components/ui";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth.schemas";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";

export default function LoginPage() {
  const { onSubmit, isPending, error: loginError } = useAuthContext();
  const searchParams = useSearchParams();
  const app = searchParams.get("app") || "OG";
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const checkCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(event.getModifierState("CapsLock"));
  };

  const token = searchParams.get('token') || undefined;
  const emailParam = searchParams.get('email') || undefined;

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailParam || "",
      password: "",
      rememberMe: false
    }
  });

  const { handleSubmit } = methods;

  const handleFormSubmit = (formData: any) => {
    onSubmit({ ...formData, token });
  }

  return (
    <>
      <main className="flex items-center justify-center px-6 pb-4 md:pt-1 pt-20">
        <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
          <div className="bg-bg-secondary rounded-2xl sm:rounded-[16px] px-4 sm:px-14 py-3 sm:py-4">
            <div className="text-center mb-3 mt-2 sm:mb-4">
              <h1 className="text-base sm:text-xl font-bold text-text">
                Welcome back
              </h1>
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-2 sm:space-y-3"
              >
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  disabled={!!emailParam}
                  placeholder="Enter Email"
                  {...methods.register("email", {
                    required: "Email is required",
                  })}
                  error={methods.formState.errors.email?.message as string}
                />

                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter Password"
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

                <div className="flex items-center justify-between pt-1 sm:pt-2">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      {...methods.register("rememberMe")}
                      className="w-3 h-3 sm:w-4 sm:h-4 border bg-primary rounded  focus:ring-primary cursor-pointer"
                    />
                    <span className="text-xs font-semibold">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-primary underline hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="pt-2 sm:pt-3 sm:mt-5">
                  <Button
                    type="submit"
                    isLoading={isPending}
                    disabled={isPending || Object.keys(methods.formState.errors).length > 0}
                    variant="primary"
                    className="w-full h-8 sm:h-9 text-white text-xs bg-primary hover:bg-primary/80 sm:text-sm font-bold rounded-full"
                  >
                    {!isPending ? "Sign In" : "Signing in ..."}
                  </Button>
                </div>
              </form>
            </FormProvider>

            <div className="my-3 sm:my-7 flex items-center">
              <div className="flex-1 border-t border"></div>
              <span className="px-2 sm:px-3 text-xs sm:text-sm">
                Or
              </span>
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
              <span className="text-xs sm:text-sm">
                Don't have an account{" "}
              </span>
              <Link
                href={`/sign-up?app=${app}`}
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
}
