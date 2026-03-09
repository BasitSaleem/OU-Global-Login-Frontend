"use client";

import Image from "next/image";
import { Icons } from "@/components/utils/icons";
import { Button, Input } from "@/components/ui";
import { useChangePassword } from "@/apiHooks.ts/auth/auth.api";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "@/schemas/auth.schemas";
import { passwordValidation } from "@/schemas/password.schema";
import ChangePasswordRuleItem from "@/components/ChangePasswordRuleItem";





export default function ChangePasswordPage() {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const methods = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
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

  const passwordChecks = {
    length: newPassword?.length >= 8,
    number: /[0-9]/.test(newPassword || ""),
    symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword || ""),
    upperLower:
      /[A-Z]/.test(newPassword || "") && /[a-z]/.test(newPassword || ""),
  };

  const isConfirmDisabled = !isNewPasswordValid;

  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const checkCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(event.getModifierState("CapsLock"));
  };

  const handleFormSubmit = (formData: ChangePasswordSchemaType) => {
    changePassword(formData, {
      onSuccess: () => {
        methods.reset();
      }
    });
  };

  return (
    <main className="p-3">
      <div className="flex items-center justify-center">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl lg:m-10 border rounded-lg">
          {/* Left Panel */}
          <div className="w-full lg:w-[420px] flex flex-col bg-[#795CF512] justify-center border-r items-center p-6 rounded-t lg:rounded-l lg:rounded-tr-none lg:h-[550px] bg-bg-se">
            <div className="flex flex-col items-center  text-center space-y-4">
              <Image
                src={Icons.security}
                alt="Security Shield Icon"
                width={100}
                height={100}
              />
              <h2 className="text-heading-1 mt-10 font-bold ">
                Password Security
              </h2>
              {/* <ul className="mt-5 space-y-3 text-body-small ">
                <li>• At least 8 characters</li>
                <li>• Include numbers and symbols</li>
                <li>• Mix uppercase & lowercase</li>
              </ul> */}

              <ul className="mt-5 space-y-3 text-body-small">
                <ChangePasswordRuleItem valid={passwordChecks.length}>
                  At least 8 characters
                </ChangePasswordRuleItem>

                <ChangePasswordRuleItem
                  valid={passwordChecks.number && passwordChecks.symbol}
                >
                  Include numbers and symbols
                </ChangePasswordRuleItem>

                <ChangePasswordRuleItem valid={passwordChecks.upperLower}>
                  Mix uppercase & lowercase
                </ChangePasswordRuleItem>
              </ul>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 bg-bg-secondary p-9 rounded-b lg:rounded-r lg:rounded-bl-none flex items-center justify-center">
            <div className="w-full max-w-md space-y-5">
              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-heading-1 font-bold ">Change Password</h1>
                <p className="leading-snug">
                  Ensure your account stays secure with a strong password that
                  you don’t use elsewhere.
                </p>
              </div>

              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(handleFormSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* Current Password */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        label="Current Password"
                        type="password"
                        placeholder="Enter Current Password"
                        isPassword={true}
                        {...methods.register("oldPassword", {
                          required: "current Password is required",
                        })}
                        onKeyUp={checkCapsLock}
                        error={
                          methods.formState.errors.oldPassword
                            ?.message as string
                        }
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        id="newPassword"
                        label="New Password"
                        type="password"
                        placeholder="Enter New Password"
                        isPassword={true}
                        {...methods.register("newPassword", {
                          required: "New Password is required",
                        })}
                        onKeyUp={checkCapsLock}
                        error={
                          methods.formState.errors.newPassword
                            ?.message as string
                        }
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        disabled={isConfirmDisabled}
                        placeholder="Confirm New Password"
                        isPassword={true}
                        {...methods.register("confirmPassword", {
                          required: "Confirm New Password is required",
                        })}
                        onKeyUp={checkCapsLock}
                        error={
                          methods.formState.errors.confirmPassword
                            ?.message as string
                        }
                      />
                    </div>
                  </div>

                  {/* Update Button */}
                  <Button
                    className="w-full bg-primary text-white hover:bg-primary/70"
                    variant="primary"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
