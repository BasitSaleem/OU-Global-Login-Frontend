"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

import BillingAddOnsList from "@/components/pages/OrganizationDetails/Billing/BillingAddOnsList";
import { BillingCycle } from "@/components/pages/OrganizationDetails/Billing/BillingCycleToggle";
import { Button } from "@/components/ui";
import { useAppDispatch } from "@/redux/store";
import { setSelectedAddons } from "@/redux/slices/checkout.slice";
import { useGetAllAddons } from "@/apiHooks.ts/addons/addons.api";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { getAvailableAddons } from "@/utils/addon-utils";

interface BillingAddOnsSectionProps {
  organization: OgOrganization;
}

const ignoreStatus = ["TRIAL", "CANCELLED", "OVER_DUE"];

const BillingAddOnsSection = ({ organization }: BillingAddOnsSectionProps) => {
  const subscription = organization?.subscriptions?.[0];
  const invoices = subscription?.invoices;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = useParams<{ orgId: string }>();

  const { data, isLoading } = useGetAllAddons();

  const availableAddons = getAvailableAddons(data?.addons ?? [], invoices);

  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>(
    {},
  );

  const updateAddonQuantity = useCallback(
    (addOnId: string, quantity: number) => {
      setSelectedAddOns((prev) => {
        const next = { ...prev };
        if (quantity <= 0) {
          delete next[addOnId];
        } else {
          next[addOnId] = quantity;
        }
        return next;
      });
    },
    [],
  );

  const selectedCount = Object.keys(selectedAddOns).length;

  const handleProceedToCheckout = () => {
    const payload = Object.entries(selectedAddOns).map(
      ([addonId, quantity]) => ({ addonId, quantity }),
    );
    dispatch(setSelectedAddons(payload));
    router.push(`/organization-details/${orgId}/billing/checkout/add-ons`);
  };

  if (ignoreStatus.includes(subscription?.status)) {
    return null;
  }
  return (
    <div className="mt-10 bg-primary/10 rounded-xl p-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-foreground">Add Ons</h2>
        </div>

        <Button
          id="billing-addons-proceed-btn"
          variant="primary"
          rightIcon={<ArrowRight />}
          disabled={selectedCount === 0}
          className="bg-[#1AD1B9] rounded-lg border-none hover:bg-[#1AD1B9]/80  text-white font-semibold py-5 px-4"
          onClick={handleProceedToCheckout}
        >
          Add in Plan
        </Button>
      </div>

      {/* Add-ons list */}
      {isLoading ? (
        <div className="bg-bg-secondary border rounded-xl p-8 flex items-center justify-center gap-3 text-text">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm">Loading add-ons…</span>
        </div>
      ) : (
        <BillingAddOnsList
          addOns={availableAddons}
          selectedAddOns={selectedAddOns}
          billingCycle={subscription?.billing_cycle as "MONTHLY" | "YEARLY"}
          onUpdateQuantity={updateAddonQuantity}
        />
      )}
    </div>
  );
};

export default BillingAddOnsSection;
