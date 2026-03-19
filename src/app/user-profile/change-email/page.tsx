"use client";
import { getAllIdentities, useRemoveIdentity, useSendChangeEmailVerification } from "@/apiHooks.ts/auth/auth.api";
import { Button, Input } from "@/components/ui";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { changeEmailSchema } from "@/schemas/auth.schemas";
import RemoveIdentityModal from "@/components/modals/RemoveIdentityModal";

export default function EmailSettingsPage() {
  const { mutate: sendChangeEmailVerification, isPending } =
    useSendChangeEmailVerification();
  const { mutate: removeIdentity, isPending: isRemoving } = useRemoveIdentity();
  const { user } = useAppSelector((state) => state.auth);

  const { data: identityData } = getAllIdentities();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [identityToDelete, setIdentityToDelete] = useState<any>(null);

  const methods = useForm<z.infer<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      oldEmail: user?.email || "",
      newEmail: "",
      confirmEmail: "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      methods.reset({
        oldEmail: user.email,
        newEmail: "",
        confirmEmail: "",
      });
    }
  }, [user?.email, methods]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { handleSubmit } = methods;

  const onSubmit = (data: z.infer<typeof changeEmailSchema>) => {
    sendChangeEmailVerification(
      { newEmail: data.newEmail },
      {
        onSuccess: () => {
          methods.reset();
          setShowSuccessModal(true);
        },
      },
    );
  };

  const handleRemoveIdentity = () => {
    if (identityToDelete) {
      removeIdentity(identityToDelete.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setIdentityToDelete(null);
        }
      });
    }
  };

  return (
    <main className="p-3">
      <div className="flex items-center justify-center">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl lg:m-10 border rounded-lg overflow-hidden">
          <div className="w-full lg:w-[420px] flex flex-col bg-primary/10 justify-center border-r items-center p-6 lg:p-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <SvgIcon name="email" className="w-20 h-20 text-primary" />
              <h2 className="text-heading-1 mt-10 font-bold">
                Email Security
              </h2>
              <ul className="mt-5 space-y-3 text-body-small text-left w-full">
                <li>• Use a valid email address</li>
                <li>
                  • Once you send the request you will receive an email to
                  verify the new email address
                </li>
                <li>
                  • You will not be able to login with the old email address
                  after the new email address is verified
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 bg-bg-secondary p-6 lg:p-12 flex flex-col">
            <div className="w-full max-w-lg mx-auto space-y-8">
              {showSuccessModal ? (
                <div className="space-y-6 text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SvgIcon
                      name="email"
                      className="w-10 h-10 text-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-text">
                      Verification Sent!
                    </h2>
                    <p className="leading-relaxed">
                      Your change email verification has been sent to your email{" "}
                      <span className="font-bold text-primary">
                        {user?.email}
                      </span>
                      . Please confirm it to change your email.
                    </p>
                  </div>
                  <Button onClick={() => setShowSuccessModal(false)}>Go Back</Button>
                </div>
              ) : (
                <>
                  <section className="space-y-6">
                    <div className="space-y-2">
                      <h1 className="text-2xl lg:text-3xl font-bold">Change Email</h1>
                      <p className="text-text-secondary leading-snug">
                        Ensure your account stays secure with a strong email that
                        you don’t use elsewhere.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Input
                        label="Current Email"
                        name="oldEmail"
                        value={user?.email}
                        disabled
                      />
                      <div className="space-y-1">
                        <Input
                          label="New Email"
                          {...methods.register("newEmail")}
                          placeholder="Enter your new email"
                          error={methods.formState.errors?.newEmail?.message}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Input
                          label="Confirm New Email"
                          {...methods.register("confirmEmail")}
                          error={methods.formState.errors?.confirmEmail?.message}
                          placeholder="Confirm your new email"
                          required
                        />
                      </div>
                      {identityData?.identities?.length > 0 &&
                        <div className="space-y-1">
                          {identityData.identities.map((identity: any) => <Input
                            leftIcon={<SvgIcon name={identity.provider} className="w-4 h-4" />}
                            label="Connected Accounts"
                            value={identity.provider}
                            disabled
                            rightIcon={<Button
                              className=" h-1 w-fit text-sm px-2 py-3"
                              variant="primary"
                              type="button"
                              onClick={() => {
                                setShowDeleteModal(true)
                                setIdentityToDelete(identity)
                              }}
                            >
                              Manage
                            </Button>}
                          />)}

                        </div>}

                      <Button
                        className="w-full h-12"
                        variant="primary"
                        type="submit"
                        disabled={isPending}
                        isLoading={isPending}
                      >
                        Update Email
                      </Button>
                    </form>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <RemoveIdentityModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        identityToDelete={identityToDelete}
        handleRemoveIdentity={handleRemoveIdentity}
        isRemoving={isRemoving}
      />
    </main>
  );
}

