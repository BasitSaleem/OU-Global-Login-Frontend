'use client'

import { useSendChangeEmailVerification } from "@/apiHooks.ts/auth/auth.api";
import { Button, Input } from "@/components/ui";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { toast } from "@/hooks/useToast";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { changeEmailSchema } from "@/schemas/auth.schemas";

export default function EmailSettingsPage() {
  const { mutate: sendChangeEmailVerification, isPending } = useSendChangeEmailVerification();
  const { user } = useAppSelector((state) => state.auth);
  const methods = useForm({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
      confirmEmail: "",
    },
  })
  const [showModal, setShowModal] = useState(false);
  const { handleSubmit } = methods;
  const onSubmit = (data: z.infer<typeof changeEmailSchema>) => {
    sendChangeEmailVerification({ newEmail: data.newEmail }, {
      onSuccess: () => {
        methods.reset();
        setShowModal(true);
      },
    });
  }
  return (
    <main className="p-3">
      <div className="flex items-center justify-center">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl lg:m-10 border rounded-lg">
          {/* Left Panel */}
          <div
            className="w-full lg:w-[420px] flex flex-col bg-[#795CF512] justify-center border-r items-center p-6 rounded-t lg:rounded-l lg:rounded-tr-none lg:h-[550px] bg-bg-se"
          >
            <div className="flex flex-col items-center  text-center space-y-4">
              <SvgIcon name="email" className="w-20 h-20 text-primary" />
              <h2 className="text-heading-1 mt-10 font-bold ">Email Security</h2>
              <ul className="mt-5 space-y-3 text-body-small ">
                <li>• Use a valid email address</li>
                <li>• Once you send the request you will receive an email to verify the new email address</li>
                <li>• You will not be able to login with the old email address after the new email address is verified</li>
              </ul>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 bg-bg-secondary p-9 rounded-b lg:rounded-r lg:rounded-bl-none flex items-center justify-center">
            <div className="w-full max-w-md space-y-5">
              {showModal ? (
                <div className="space-y-6 text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SvgIcon name="email" className="w-10 h-10 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-text">Verification Sent!</h2>
                    <p className="leading-relaxed">
                      Your change email verification has been sent to your email <span className="font-bold text-primary">{user?.email}</span>. Please confirm it to change your email.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h1 className="text-heading-1 font-bold ">Change Email</h1>
                    <p className="leading-snug">
                      Ensure your account stays secure with a strong email that you don’t use elsewhere.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                      label="Current Email"
                      name="email"
                      value={user?.email}
                      disabled
                    />
                    {/* New Email */}
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          label="New Email"
                          {...methods.register("newEmail")}
                          placeholder="Enter your new email"
                          required
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          label="Confirm New Email"
                          {...methods.register("confirmEmail")}
                          placeholder="Enter your new email"
                          required
                        />
                      </div>
                    </div>

                    {/* Update Button */}
                    <Button
                      className="w-full bg-primary text-white hover:bg-primary/70 py-5"
                      variant="primary"
                      type="submit"
                      disabled={isPending || !methods.formState.isValid}
                    >
                      {isPending ? "Sending..." : "Update Email"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );

}
