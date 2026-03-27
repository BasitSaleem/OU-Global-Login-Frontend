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
      <div className="flex justify-center items-center">
        <div className="flex lg:flex-row flex-col lg:m-10 border rounded-lg w-full max-w-6xl overflow-hidden">
          <div className="flex flex-col justify-center items-center bg-primary/10 p-6 lg:p-10 border-r w-full lg:w-[420px]">
            <div className="flex flex-col items-center space-y-4 text-center">
              <SvgIcon name="email" className="w-20 h-20 text-primary" />
              <h2 className="mt-10 font-bold text-heading-1">
                Email Security
              </h2>
              <ul className="space-y-3 mt-5 w-full text-body-small text-left">
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

          <div className="flex flex-col flex-1 bg-bg-secondary p-6 lg:p-12">
            <div className="space-y-8 mx-auto w-full max-w-lg">
              {showSuccessModal ? (
                <div className="slide-in-from-bottom-4 space-y-6 py-8 text-center animate-in duration-500 fade-in">
                  <div className="flex justify-center items-center bg-green-50 mx-auto mb-6 rounded-full w-20 h-20">
                    <SvgIcon
                      name="email"
                      className="w-10 h-10 text-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-bold text-text text-2xl">
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
                      <h1 className="font-bold text-2xl lg:text-3xl">Change Email</h1>
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
                      {/* {identityData?.identities?.length > 0 &&
                        <div className="space-y-1">
                          {identityData.identities.map((identity: any) => <Input
                            leftIcon={<SvgIcon name={identity.provider} className="w-4 h-4" />}
                            label="Connected Accounts"
                            value={identity.provider}
                            disabled
                            rightIcon={<Button
                              className="px-2 py-3 w-fit h-1 text-sm"
                              variant="primary"
                              type="button"
                              onClick={() => {
                                setShowDeleteModal(true);
                                setIdentityToDelete(identity);
                              }}
                            >
                              Manage
                            </Button>}
                          />)}

                        </div>} */}

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

