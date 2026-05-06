"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, CalendarDays, Receipt, Zap } from "lucide-react";
import { useGetPaymentMethods } from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";
import {
  useBuyNewAddons,
  useGetStripeTax,
  usePreviewAddon,
} from "@/apiHooks.ts/subscription/subscription.api";
import { useGetBillingInfo } from "@/apiHooks.ts/billing/billing.api";
import { useGetAllAddons } from "@/apiHooks.ts/addons/addons.api";
import { PaymentMethod } from "@/apiHooks.ts/paymentMethod/paymentMethod.types";
import { AddOnType } from "@/apiHooks.ts/addons/addons.types";
import {
  AddOnsSection,
  PaymentMethodSelector,
  InvoiceCountry,
} from "@/components/pages/Checkout";
import AddOnsOrderSummary from "@/components/pages/Checkout/AddOnsOrderSummary";
import { CheckoutFormValues } from "@/components/pages/Checkout/InvoiceCountry";
import CheckoutHeader from "@/components/pages/Checkout/CheckoutHeader";
import CheckOutSkeleton from "@/components/pages/Checkout/CheckOutSkeleton";
import StripeWrapper from "@/components/pages/OrganizationDetails/PaymentMethods/StripeWrapper";
import PaymentSuccessModal from "@/components/modals/PaymentSuccessModal";
import { checkoutSchema } from "@/schemas/checkout.schemas";
import { toast } from "@/hooks/useToast";
import logger from "@/utils/logger";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { clearCheckout } from "@/redux/slices/checkout.slice";
// import AddonLineItem from "@/components/pages/Checkout/addonLineItem";

const AddonCheckoutContent = () => {
  const { orgId } = useParams<{ orgId: string }>();

  const dispatch = useAppDispatch();
  const reduxAddons = useAppSelector((state) => state.checkout.selectedAddons);

  // Clear the Redux cart when leaving this page
  useEffect(() => {
    return () => {
      dispatch(clearCheckout());
    };
  }, [dispatch]);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>(
    () =>
      Object.fromEntries(
        reduxAddons.map(({ addonId, quantity }) => [addonId, quantity]),
      ),
  );

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────
  const { data: addonsData, isPending: loadingAddons } = useGetAllAddons();
  const { data: paymentMethodsData, isPending: loadingPaymentMethods } =
    useGetPaymentMethods(orgId);
  const { data: organization, isPending: loadingOrg } =
    useOrganizationDetails(orgId);
  const { data: billingInfo, isPending: loadingBillingInfo } =
    useGetBillingInfo();

  const currentSubscription = organization?.subscriptions?.[0];
  const billingCycle = currentSubscription?.billing_cycle;
  const subscriptionId = currentSubscription?.id ?? null;

  const availableAddOns = useMemo<AddOnType[]>(() => {
    return addonsData?.addons ?? [];
  }, [addonsData?.addons]);

  const paymentMethods: PaymentMethod[] =
    paymentMethodsData?.paymentMethods || [];

  // ── Preview add-on proration ───────────────────────────────────────────
  const {
    mutate: previewAddon,
    data: previewData,
    isPending: isLoadingPreview,
    isError: isPreviewError,
    error: previewError,
    reset: resetPreview,
  } = usePreviewAddon();

  // Build the addons array for preview payload (use DB ids)
  const previewPayload = useMemo(
    () =>
      Object.entries(selectedAddOns).map(([addonId, quantity]) => ({
        addonId,
        quantity,
      })),
    [selectedAddOns],
  );

  // Debounced preview call whenever selectedAddOns changes
  useEffect(() => {
    if (previewPayload.length === 0) {
      resetPreview();
      return;
    }
    const timer = setTimeout(() => {
      previewAddon({ orgId, addons: previewPayload });
    }, 600);
    return () => clearTimeout(timer);
  }, [previewPayload, orgId, previewAddon, resetPreview]);

  // ── Tax mutation ───────────────────────────────────────────────────────
  const {
    mutate: getTax,
    data: taxData,
    isPending: isCalculatingTax,
  } = useGetStripeTax();

  // ── Form ───────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors: formErrors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "",
      billing_address: "",
      billing_city: "",
      billing_state: "",
      billing_postal_code: "",
    },
  });

  const [hasPrefilled, setHasPrefilled] = useState(false);
  useEffect(() => {
    if (billingInfo && !hasPrefilled) {
      reset({
        country: billingInfo.country || "",
        billing_address: billingInfo.address || "",
        billing_city: billingInfo.city || "",
        billing_state: billingInfo.state || "",
        billing_postal_code: billingInfo.postal_code || "",
      });
      setHasPrefilled(true);
    }
  }, [billingInfo, reset, hasPrefilled]);

  const watchFields = watch();

  // ── Add-on stripe price payload (for tax + checkout) ──────────────────
  const addOnPayload = useMemo(() => {
    const payload: { priceId: string; quantity: number }[] = [];
    Object.entries(selectedAddOns).forEach(([id, quantity]) => {
      const addon = availableAddOns.find((a) => a.id === id);
      if (addon) {
        const pId =
          billingCycle === "MONTHLY"
            ? addon.stripe_price_monthly_id
            : addon.stripe_price_yearly_id;
        if (pId) payload.push({ priceId: pId, quantity });
      }
    });
    return payload;
  }, [selectedAddOns, availableAddOns, billingCycle]);

  // ── Auto tax calculation ───────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!watchFields.country || !currentSubscription?.oiPackage?.id) return;

      const isUS = watchFields.country === "US";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        packageId: currentSubscription.oiPackage.id,
        billingCycle: billingCycle?.toUpperCase() as "MONTHLY" | "YEARLY",
        addOnPriceIds: addOnPayload,
        country: watchFields.country,
      };

      if (isUS) {
        const isComplete =
          watchFields.billing_state &&
          watchFields.billing_postal_code &&
          watchFields.billing_address &&
          watchFields.billing_city;
        if (!isComplete) return;
        payload.billing_state = watchFields.billing_state;
        payload.billing_postal_code = watchFields.billing_postal_code;
        payload.billing_address = watchFields.billing_address;
        payload.billing_city = watchFields.billing_city;
      }

      getTax(payload);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    getTax,
    currentSubscription,
    billingCycle,
    addOnPayload,
    watchFields.country,
    watchFields.billing_state,
    watchFields.billing_postal_code,
  ]);

  // Reset US-specific fields on country change
  useEffect(() => {
    if (watchFields.country && watchFields.country !== "US") {
      setValue("billing_address", "");
      setValue("billing_city", "");
      setValue("billing_state", "");
      setValue("billing_postal_code", "");
    }
  }, [watchFields.country, setValue]);

  // ── Default payment method ─────────────────────────────────────────────
  useEffect(() => {
    if (!selectedPaymentMethodId && paymentMethods.length > 0) {
      const primary = paymentMethods.find((m) => m.is_primary);
      setSelectedPaymentMethodId(primary?.id || paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  // ── Quantity management ────────────────────────────────────────────────
  const updateAddOnQuantity = useCallback(
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

  // ── Checkout handler ───────────────────────────────────────────────────
  const { mutateAsync: buyNewAddons, isPending: isProcessing } =
    useBuyNewAddons();

  const handleCheckout = async (data: CheckoutFormValues) => {
    if (!selectedPaymentMethodId) return;

    if (!currentSubscription || currentSubscription.status === "CANCELLED") {
      toast.error(
        "No active subscription",
        "Please subscribe to a plan before adding add-ons.",
      );
      return;
    }

    try {
      await buyNewAddons({
        orgId,
        subscriptionId: subscriptionId ?? "",
        billingCycle: billingCycle?.toUpperCase() as "MONTHLY" | "YEARLY",
        addons: addOnPayload,
        country: data.country,
        ...(data.country === "US" && {
          billing_city: data.billing_city,
          billing_state: data.billing_state,
          billing_postal_code: data.billing_postal_code,
          billing_address: data.billing_address,
        }),
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      logger.error("Add-ons checkout error:", error);
    }
  };

  const handleScrollToBillingInfo = () => {
    document
      .getElementById("billing-info-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (
    loadingAddons ||
    loadingPaymentMethods ||
    loadingOrg ||
    loadingBillingInfo
  ) {
    return <CheckOutSkeleton />;
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-full mx-auto md:px-8 pb-60">
      <CheckoutHeader description="Review your add-ons and complete your subscription" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Left column ───────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add-ons selector */}
          <AddOnsSection
            addOns={availableAddOns.map((addon) => ({
              id: addon.id,
              packageId: "",
              addOnId: addon.id,
              addOn: addon,
            }))}
            selectedAddOns={selectedAddOns}
            billingCycle={billingCycle?.toLowerCase() as "monthly" | "yearly"}
            onUpdateQuantity={updateAddOnQuantity}
          />

          {/* ── Add-on preview proration panel ───────────────────── */}
          {Object.keys(selectedAddOns).length > 0 && (
            <div className="bg-bg-secondary border rounded-xl p-6">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                {/* Proration Preview */}
                Current & Upcoming Charges
              </h3>

              {isLoadingPreview && (
                <div className="flex items-center gap-3 text-sm text-text py-4 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Calculating prorated charges…
                </div>
              )}

              {isPreviewError && !isLoadingPreview && (
                <div className="flex items-start gap-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Preview unavailable</p>
                    <p className="text-xs mt-0.5 text-red-400">
                      {(previewError as Error)?.message ||
                        "Could not calculate proration. You can still proceed to checkout."}
                    </p>
                  </div>
                </div>
              )}

              {!isLoadingPreview && !isPreviewError && previewData && (
                <div className="space-y-4">
                  {/* Charge today */}
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="font-medium">Charged today</span>
                      <span className="text-xs text-text">(prorated)</span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {/* {previewData.currency?.toUpperCase() ?? "USD"} */}$
                      {parseFloat(previewData.chargeToday).toFixed(2)}
                    </span>
                  </div>

                  {/* Renewal total */}
                  <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="w-4 h-4 text-text" />
                      <span className="font-medium">Next renewal</span>
                      {previewData.renewalDate && (
                        <span className="text-xs text-text">
                          (
                          {new Date(previewData.renewalDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                          )
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold">
                      {/* {previewData.currency?.toUpperCase() ?? "USD"} */}$
                      {parseFloat(previewData.renewalTotal).toFixed(2)}
                    </span>
                  </div>

                  {/* Breakdown rows */}
                  {/* {previewData.breakdown?.length > 0 && (
                    <AddonLineItem previewData={previewData} />
                  )} */}
                </div>
              )}

              {/* Placeholder when no data yet (initial / reset) */}
              {!isLoadingPreview && !isPreviewError && !previewData && (
                <p className="text-sm text-text text-center py-4">
                  Select add-ons above to see the prorated charge.
                </p>
              )}
            </div>
          )}

          {/* Billing info */}
          <div id="billing-info-section" className="scroll-mt-24">
            <InvoiceCountry
              control={control}
              register={register}
              errors={formErrors}
              watchCountry={watchFields.country}
            />
          </div>

          {/* Payment method */}
          <PaymentMethodSelector
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onSelectPaymentMethod={setSelectedPaymentMethodId}
            onManageCards={() => setIsModalOpen(true)}
            orgId={orgId}
          />
        </div>

        {/* ── Right column — sticky order summary ───────────────────── */}
        <div className="lg:col-span-1 self-start sticky top-10 z-10">
          <AddOnsOrderSummary
            country={watchFields.country}
            isPaymentMethodAvailable={paymentMethods.length > 0}
            billingCycle={billingCycle as "MONTHLY" | "YEARLY"}
            selectedAddOns={selectedAddOns}
            availableAddOns={availableAddOns}
            taxDetails={taxData}
            isProcessing={isProcessing}
            isCalculatingTax={isCalculatingTax}
            chargeToday={previewData?.chargeToday ?? null}
            isLoadingChargeToday={isLoadingPreview}
            canCheckout={
              !!selectedPaymentMethodId &&
              Object.keys(selectedAddOns).length > 0 &&
              !isPreviewError
            }
            onCheckout={handleSubmit(handleCheckout)}
            onManageCards={() => setIsModalOpen(true)}
            onAddBillingInfo={handleScrollToBillingInfo}
          />
        </div>

        {isModalOpen && (
          <StripeWrapper orgId={orgId} onClose={() => setIsModalOpen(false)} />
        )}

        <PaymentSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          planName="Add-ons"
        />
      </div>
    </div>
  );
};

export default AddonCheckoutContent;
