"use client";

import Image from "next/image";
import { Icons } from "@/components/utils/icons";
import { Button, Input } from "@/components/ui";
import { useChangePassword } from "@/apiHooks.ts/auth/auth.api";
import { useState } from "react";
export default function ChangePasswordPage() {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const [formState, setFormState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.oldPassword || !formState.newPassword || !formState.confirmPassword) {
      setError({
        oldPassword: !formState.oldPassword ? "Please enter your old password" : "",
        newPassword: !formState.newPassword ? "Please enter your new password" : "",
        confirmPassword: !formState.confirmPassword ? "Please enter your confirm password" : "",
      })
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      setError({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "Passwords do not match",
      })
      return;
    }

    if (formState.newPassword.length < 8) {
      setError({
        oldPassword: "",
        newPassword: "New password must be at least 8 characters long",
        confirmPassword: "",
      })
      return;
    }

    try {
      await changePassword({
        oldPassword: formState.oldPassword,
        newPassword: formState.newPassword,
      });
      setFormState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Error handled by mutation onError
    }
  };

  return (
    <main className="p-3">
      <div className="flex items-center justify-center">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl lg:m-10 border rounded-lg">
          {/* Left Panel */}
          <div
            className="w-full lg:w-[420px] flex flex-col bg-[#795CF512] justify-center border-r items-center p-6 rounded-t lg:rounded-l lg:rounded-tr-none lg:h-[550px] bg-bg-se"
          >
            <div className="flex flex-col items-center  text-center space-y-4">
              <Image
                src={Icons.security}
                alt="Security Shield Icon"
                width={100}
                height={100}
              />
              <h2 className="text-heading-1 mt-10 font-bold ">Password Security</h2>
              <ul className="mt-5 space-y-3 text-body-small ">
                <li>• At least 8 characters</li>
                <li>• Include numbers and symbols</li>
                <li>• Mix uppercase & lowercase</li>
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
                  Ensure your account stays secure with a strong password that you don’t use elsewhere.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      isPassword
                      label="Current Password"
                      name="oldPassword"
                      value={formState.oldPassword}
                      onChange={handleFormChange}
                      required
                      error={error.oldPassword}
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      isPassword
                      label="New Password"
                      name="newPassword"
                      value={formState.newPassword}
                      onChange={handleFormChange}
                      required
                      error={error.newPassword}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      isPassword
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={formState.confirmPassword}
                      onChange={handleFormChange}
                      required
                      error={error.confirmPassword}
                    />
                  </div>
                </div>

                {/* Update Button */}
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/70 py-5"
                  variant="primary"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

}
