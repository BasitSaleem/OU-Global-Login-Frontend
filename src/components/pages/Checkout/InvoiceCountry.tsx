import React from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui";
import {
  Control,
  Controller,
  UseFormRegister,
  FieldErrors,
  useWatch,
} from "react-hook-form";
import {
  US_STATES,
  US_CITIES_BY_STATE,
  MAJOR_US_CITIES,
  COUNTRIES,
} from "@/utils/countriesData";

export interface CheckoutFormValues {
  country: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
}

interface InvoiceCountryProps {
  control: Control<CheckoutFormValues>;
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  watchCountry: string;
}

const InvoiceCountry = ({
  control,
  register,
  errors,
  watchCountry,
}: InvoiceCountryProps) => {
  // Watch the state field to update cities dynamically
  const selectedState = useWatch({
    control,
    name: "billing_state",
  });

  const cityOptions = selectedState
    ? US_CITIES_BY_STATE[selectedState] || MAJOR_US_CITIES
    : MAJOR_US_CITIES;
  return (
    <div className="border rounded-xl mb-9">
      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="font-semibold text-sm text-text">
              Billing Information
            </h1>
            <p className="text-text-secondary text-xs">
              This information will help us verify the correct tax on your
              invoice.
            </p>
          </div>

          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Country"
                isRequired={true}
                options={COUNTRIES}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Country"
                error={errors.country?.message}
              />
            )}
          />

          {watchCountry === "US" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
              <Input
                label="Billing Address"
                placeholder="123 Main St"
                {...register("billing_address")}
                isRequired={true}
                error={errors.billing_address?.message}
                className="md:col-span-2"
              />
              <Controller
                name="billing_state"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    label="Billing State"
                    isRequired={true}
                    options={US_STATES}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select State"
                    error={errors.billing_state?.message}
                  />
                )}
              />

              <Controller
                name="billing_city"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    label="Billing City"
                    isRequired={true}
                    options={cityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select City"
                    error={errors.billing_city?.message}
                  />
                )}
              />
              <Input
                label="Billing Postal Code"
                placeholder="Postal Code"
                {...register("billing_postal_code")}
                isRequired={true}
                error={errors.billing_postal_code?.message}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCountry;
