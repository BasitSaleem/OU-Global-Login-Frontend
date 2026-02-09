"use client";
import { useUpdateProfile } from "@/apiHooks.ts/auth/auth.api";
import { userProfile } from "@/apiHooks.ts/auth/auth.types";
import { Button, Input } from "@/components/ui";
import ImageUpload from "@/components/UploadImage";
import { setProfile } from "@/redux/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { User } from "@/types/auth.types";
import { useRef, useState, RefObject } from "react";


import { useClickOutside } from "@/hooks/useClickOutSide";
import { DeleteAccountModal } from "@/components/modals/DeleteAccountModal";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userProfileSchema from "@/schemas/user-profile.schema";

export default function UserProfilePage() {
  const { mutate: updateUser, isPending, } = useUpdateProfile();
  const { user } = useAppSelector((s) => s.auth);

  const methods = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      profile_url: user?.profile_url,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      contact: user?.contact,
      street_address: user?.street_address,
      city: user?.city,
      state: user?.state,
      zip_code: user?.zip_code,
      country: user?.country,
      tax_vat_number: user?.tax_vat_number,
      emergency_contact_name: user?.emergency_contact_name,
      emergency_contact_no: user?.emergency_contact_no,
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);




  const dispatch = useAppDispatch();
  useClickOutside(
    [
      profileDropdownRef as RefObject<HTMLDivElement>,
      notificationsRef as RefObject<HTMLDivElement>,
    ],
    () => { }
  );

  const handleSaveChanges = async () => {
    const values = methods.getValues() as userProfile;

    updateUser(values);
    dispatch(
      setProfile({
        ...values,
        email: user?.email,
        id: user?.id,
        role_id: user?.role_id,
        role: user?.role,
        status: user?.status,
      } as User)
    );

    // After a successful submit, treat current values as the new baseline
    // so the form is no longer dirty until the user changes something again.
    methods.reset(values);
  };


  return (
    <div className="min-h-screen w-full bg-background flex font-inter">
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row items-start gap-5 p-8">
          <div className="flex flex-col mx-auto w-full md:w-[286px] gap-3 p-3 border rounded-lg bg-bg-secondary shadow-sm py-5">
            <div className="flex flex-col items-center gap-7">
              <div className="w-full">
                <ImageUpload
                  imageUrl={user?.profile_url || user?.profile_url}
                  onUploadComplete={(imageUrl: string) => {
                    const freshUrl = `${imageUrl}?t=${Date.now()}`;
                    methods.setValue("profile_url", freshUrl, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    if (user) {
                      dispatch(setProfile({ ...user, profile_url: freshUrl }));
                    }
                  }}
                  onDelete={() => {
                    methods.setValue("profile_url", null, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    if (user) {
                      dispatch(setProfile({ ...user, profile_url: undefined }));
                    }
                  }}
                  maxSize={2}
                  acceptedFiles="image/jpeg,image/png,image/webp"
                  id={user?.id!}
                />
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-5 flex flex-col justify-center pr-2">
              <div>
                <label className="text-body-small">Name</label>
                <p className="text-body-medium-bold">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div>
                <label className="text-body-small">Email</label>
                <p className="text-body-medium-bold overflow-ellipsis">
                  {user?.email}
                </p>
              </div>
              <div>
                <label className="text-body-small">Contact</label>
                <p className="text-body-medium-bold">
                  {user?.contact ?? "0145678"}
                </p>
              </div>
            </div>
            <Button
              className="w-full py-4 text-red-500 hover:text-white hover:bg-red-500 border border-red-500"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Account
            </Button>
          </div>

          <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            userEmail={user?.email || ""}
          />

          <div className="flex-1 border rounded-lg w-full bg-bg-secondary shadow-sm">
            <div className="flex items-center justify-between p-5 border-b">
              <h1 className="text-heading-1 font-bold text-black">
                Profile Information
              </h1>
            </div>

            {/* Form Content */}
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(handleSaveChanges)}
                className="p-6 space-y-8"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    error={methods.formState.errors.first_name?.message}
                    isRequired
                    permission="og:edit::profile"
                    type="text"
                    {...methods.register("first_name", {
                      required: "First name is required",
                    })}
                  />

                  <Input
                    isRequired
                    permission="og:edit::profile"
                    label="Last Name"
                    error={methods.formState.errors.last_name?.message}
                    type="text"
                    {...methods.register("last_name", {
                      required: "Last name is required",
                    })}
                  />

                  <Input
                    label="Email"
                    permission="og:edit::profile"
                    isRequired
                    type="email"
                    error={methods.formState.errors.email?.message}
                    {...methods.register("email", {
                      required: "Email is required",
                    })}
                    disabled
                  />

                  <Input
                    label="Contact"
                    permission="og:edit::profile"
                    type="tel"
                    error={methods.formState.errors.contact?.message}
                    {...methods.register("contact", {
                      required: "Contact is required",
                    })}
                  />
                </div>

                {/* Address Information */}
                <div>
                  <h2 className="text-heading-2 font-bold text-black mb-2">
                    Address Information
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <Input
                      label="Street Address"
                      permission="og:edit::profile"
                      type="text"
                      {...methods.register("street_address", {
                        required: "Street address is required",
                      })}
                    />

                    <Input
                      label="City"
                      permission="og:edit::profile"
                      type="text"
                      {...methods.register("city", {
                        required: "City is required",
                      })}
                    />

                    <Input
                      label="State"
                      permission="og:edit::profile"
                      type="text"
                      value={methods.getValues().state ?? ""}
                      {...methods.register("state", {
                        required: "State is required",
                      })}
                    />

                    <Input
                      label="Zip Code"
                      permission="og:edit::profile"
                      type="text"
                      value={methods.getValues().zip_code ?? ""}
                      {...methods.register("zip_code", {
                        required: "Zip code is required",
                      })}
                    />

                    <Input
                      label="Country"
                      permission="og:edit::profile"
                      type="text"
                      value={methods.getValues().country ?? ""}
                      {...methods.register("country", {
                        required: "Country is required",
                      })}
                    />

                    <Input
                      label="Tax/VAT Number"
                      permission="og:edit::profile"
                      type="tel"
                      value={methods.getValues().tax_vat_number ?? ""}
                      {...methods.register("tax_vat_number", {
                        required: "Tax/VAT number is required",
                      })}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h2 className="text-heading-2 font-bold text-black mb-2">
                    Emergency Contact
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <Input
                      label="Emergency Contact Name"
                      permission="og:edit::profile"
                      type="text"
                      value={methods.getValues().emergency_contact_name ?? ""}
                      {...methods.register("emergency_contact_name", {
                        required: "Emergency contact name is required",
                      })}
                    />

                    <Input
                      label="Emergency Contact Number"
                      permission="og:edit::profile"
                      type="tel"
                      value={methods.getValues().emergency_contact_no ?? ""}
                      {...methods.register("emergency_contact_no", {
                        required: "Emergency contact number is required",
                      })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    className=" bg-primary text-white hover:bg-primary/70"
                    permission="og:edit::profile"
                    type="submit"
                    disabled={
                      methods.formState.isSubmitting ||
                      !methods.formState.isValid ||
                      !methods.formState.isDirty
                    }
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
    </div>
  );
}
