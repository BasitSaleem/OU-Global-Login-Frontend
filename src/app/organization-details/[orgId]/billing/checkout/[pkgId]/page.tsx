"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetPlanDetails } from "@/apiHooks.ts/plans/plans.api";
import { useGetPaymentMethods } from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";
import {
  useBuyNewPlan,
  useGetStripeTax,
  useUpgradePlan,
} from "@/apiHooks.ts/subscription/subscription.api";
import { PaymentMethod } from "@/apiHooks.ts/paymentMethod/paymentMethod.types";
import { packageAddOnsType } from "@/apiHooks.ts/plans/plans.types";
import {
  PlanCard,
  AddOnsSection,
  PaymentMethodSelector,
  OrderSummary,
  InvoiceCountry,
} from "@/components/pages/Checkout";
import { CheckoutFormValues } from "@/components/pages/Checkout/InvoiceCountry";
import PackageNotFound from "@/components/pages/Checkout/PackageNotFound";
import { toast } from "@/hooks/useToast";
import { checkoutSchema } from "@/schemas/checkout.schemas";
import CheckoutHeader from "@/components/pages/Checkout/CheckoutHeader";
import CheckOutSkeleton from "@/components/pages/Checkout/CheckOutSkeleton";
import StripeWrapper from "@/components/pages/OrganizationDetails/PaymentMethods/StripeWrapper";

type BillingCycle = "monthly" | "yearly";

function CheckoutPage() {
  const { orgId, pkgId } = useParams<{ orgId: string; pkgId: string }>();
  const router = useRouter();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>(
    {},
  );

  const { data: planData, isPending: loadingPlan } = useGetPlanDetails(atob(pkgId as string));
  const { data: paymentMethodsData, isPending: loadingPaymentMethods } =
    useGetPaymentMethods(atob(orgId as string));
  const { data: organization, isPending: loadingOrg } =
    useOrganizationDetails(atob(orgId as string));

  const currentSubscription = organization?.subscriptions?.[0];
  const subscriptionId = currentSubscription?.id ?? null;

  const selectedPlan = useMemo(() => {
    if (!planData?.plans) return undefined;
    if (Array.isArray(planData.plans)) {
      return planData.plans.find((p) => p.id === pkgId) || planData.plans[0];
    }
    return planData.plans;
  }, [planData, pkgId]);

  const availableAddOns: packageAddOnsType[] = useMemo(() => {
    if (!selectedPlan?.packageAddOns) return [];
    return selectedPlan.packageAddOns.filter((a) => a.addOn.is_active);
  }, [selectedPlan]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const paymentMethods: PaymentMethod[] =
    paymentMethodsData?.paymentMethods || [];

  const {
    mutate: getTax,
    data: taxData,
    isPending: isCalculatingTax,
  } = useGetStripeTax();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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

  const watchFields = watch();

  const addOnPayload = useMemo(() => {
    const payload: { priceId: string; quantity: number }[] = [];
    Object.entries(selectedAddOns).forEach(([id, quantity]) => {
      const entry = availableAddOns.find((a) => a.addOnId === id);
      if (entry) {
        const pId =
          billingCycle === "monthly"
            ? entry.addOn.stripe_price_monthly_id
            : entry.addOn.stripe_price_yearly_id;

        if (pId) {
          payload.push({
            priceId: pId,
            quantity: quantity,
          });
        }
      }
    });
    return payload;
  }, [selectedAddOns, availableAddOns, billingCycle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!watchFields.country) return;

      const isUS = watchFields.country === "US";

      const payload: any = {
        packageId: pkgId,
        billingCycle: billingCycle.toUpperCase() as "MONTHLY" | "YEARLY",
        addOnPriceIds: addOnPayload,
        country: watchFields.country,
      };

      if (isUS) {
        const isComplete =
          watchFields.billing_state &&
          watchFields.billing_postal_code &&
          watchFields.billing_address &&
          watchFields.billing_city;

        // Don't call API if ANY field is missing
        if (!isComplete) return;

        // All fields exist → add them
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
    pkgId,
    billingCycle,
    addOnPayload,
    watchFields.country,
    watchFields.billing_state,
    watchFields.billing_postal_code,
  ]);

  // Reset US fields if country changes
  useEffect(() => {
    if (watchFields.country !== "US") {
      setValue("billing_address", "");
      setValue("billing_city", "");
      setValue("billing_state", "");
      setValue("billing_postal_code", "");
    }
  }, [watchFields.country, setValue]);

  const { mutateAsync: upgradePlan, isPending: isProcessing } =
    useUpgradePlan();

  const { mutateAsync: buyNewPlan, isPending: isProcessingBuyNewPlan } =
    useBuyNewPlan();

  useEffect(() => {
    if (!selectedPaymentMethodId && paymentMethods.length > 0) {
      const primary = paymentMethods.find((m) => m.is_primary);
      setSelectedPaymentMethodId(primary?.id || paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethodId]);

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

  const basePlanPrice =
    billingCycle === "monthly"
      ? parseFloat(selectedPlan?.monthly_price || "0")
      : parseFloat(selectedPlan?.yearly_price || "0");

  const addOnsTotal = useMemo(() => {
    let total = 0;
    Object.entries(selectedAddOns).forEach(([id, quantity]) => {
      const entry = availableAddOns.find((a) => a.addOnId === id);
      if (entry) {
        const price =
          billingCycle === "monthly"
            ? parseFloat(entry.addOn.monthly_price || "0")
            : parseFloat(entry.addOn.yearly_price || "0");
        total += price * quantity;
      }
    });
    return total;
  }, [selectedAddOns, availableAddOns, billingCycle]);

  const yearlyPerMonth = parseFloat(selectedPlan?.yearly_price || "0") / 12;
  const originalMonthlyPrice = parseFloat(selectedPlan?.monthly_price || "0");

  const yearlySavings =
    billingCycle === "yearly"
      ? (
        originalMonthlyPrice * 12 -
        parseFloat(selectedPlan?.yearly_price || "0")
      ).toFixed(2)
      : null;

  const discount =
    billingCycle === "monthly"
      ? (selectedPlan?.monthly_discount ?? null)
      : (selectedPlan?.yearly_discount ?? null);

  const totalPrice = useMemo(() => {
    const discPercent = parseFloat(discount || "0");
    const discountedBase = basePlanPrice * (1 - discPercent / 100);
    return discountedBase + addOnsTotal;
  }, [basePlanPrice, addOnsTotal, discount]);

  const stripePriceId =
    billingCycle === "monthly"
      ? selectedPlan?.stripe_price_monthly_id
      : selectedPlan?.stripe_price_yearly_id;

  const planFeatures = useMemo(() => {
    if (!selectedPlan) return [];
    const features: string[] = [];
    if (selectedPlan.no_of_users)
      features.push(`${selectedPlan.no_of_users} Users`);
    if (selectedPlan.no_of_stores)
      features.push(`${selectedPlan.no_of_stores} Stores`);
    if (selectedPlan.no_of_warehouses)
      features.push(`${selectedPlan.no_of_warehouses} Warehouses`);
    if (selectedPlan.no_of_products)
      features.push(`${selectedPlan.no_of_products} Products`);
    if (selectedPlan.no_of_pos)
      features.push(`${selectedPlan.no_of_pos} POS Terminals`);
    if (selectedPlan.no_of_customers)
      features.push(`${selectedPlan.no_of_customers} Customers`);
    if (selectedPlan.no_of_suppliers)
      features.push(`${selectedPlan.no_of_suppliers} Suppliers`);
    if (selectedPlan.show_online_store) features.push("Online Store");
    if (selectedPlan.show_manufacturing) features.push("Manufacturing");
    return features;
  }, [selectedPlan]);

  const handleCheckout = async (data: CheckoutFormValues) => {
    if (!selectedPaymentMethodId || !stripePriceId) return;

    const addOnPayload: { priceId: string; quantity: number }[] = [];

    Object.entries(selectedAddOns).forEach(([id, quantity]) => {
      const entry = availableAddOns.find((a) => a.addOnId === id);
      if (entry) {
        const pId =
          billingCycle === "monthly"
            ? entry.addOn.stripe_price_monthly_id
            : entry.addOn.stripe_price_yearly_id;

        if (pId) {
          addOnPayload.push({
            priceId: pId,
            quantity: quantity,
          });
        }
      }
    });

    if (
      currentSubscription &&
      currentSubscription.status !== "TRIAL" &&
      currentSubscription.status !== "CANCELLED"
    ) {
      toast.error(
        "Action Not Allowed",
        "You must have to unsubscribe a package before subscribing new package.",
      );
      return;
    }

    try {
      const payload = {
        orgId: atob(orgId as string),
        packageId: atob(pkgId as string),
        subscriptionId,
        billingCycle: billingCycle.toUpperCase() as "MONTHLY" | "YEARLY",
        priceId: stripePriceId,
        addOnPriceIds: addOnPayload,
        paymentMethodId: selectedPaymentMethodId,
        country: data.country,
        ...(data.country === "US" && {
          billing_city: data.billing_city,
          billing_state: data.billing_state,
          billing_postal_code: data.billing_postal_code,
          billing_address: data.billing_address,
        }),
      };

      if (
        currentSubscription?.status === "TRIAL" &&
        currentSubscription?.oiPackage?.id === pkgId
      ) {
        await upgradePlan(payload);
      } else {
        await buyNewPlan({ ...payload, subscriptionId: null });
      }
      router.push(`/organization-details/${orgId}/payment/success`);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };


  if (loadingPlan || loadingPaymentMethods || loadingOrg) {
    return <CheckOutSkeleton />;
  }

  if (!selectedPlan) return <PackageNotFound orgId={orgId} />;

  return (
    <div className="w-full max-w-full mx-auto md:px-8 pb-60">
      <CheckoutHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <PlanCard
            packageName={selectedPlan.package_name}
            planType={selectedPlan.type}
            currency={selectedPlan.currency}
            basePrice={basePlanPrice}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            yearlySavings={yearlySavings}
            features={planFeatures}
          />

          <AddOnsSection
            addOns={availableAddOns}
            selectedAddOns={selectedAddOns}
            billingCycle={billingCycle}
            onUpdateQuantity={updateAddOnQuantity}
          />

          <InvoiceCountry
            control={control}
            register={register}
            errors={formErrors}
            watchCountry={watchFields.country}
          />

          <PaymentMethodSelector
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onSelectPaymentMethod={setSelectedPaymentMethodId}
            onManageCards={() => setIsModalOpen(true)}
          />
        </div>

        <div className="lg:col-span-1 self-start sticky top-10 z-10">
          <OrderSummary
            country={watchFields.country}
            isPaymentMethodAvailable={paymentMethods.length > 0}
            packageName={selectedPlan.package_name}
            currency={selectedPlan.currency}
            billingCycle={billingCycle}
            basePrice={basePlanPrice}
            yearlyPerMonth={yearlyPerMonth}
            discount={discount}
            yearlySavings={yearlySavings}
            selectedAddOns={selectedAddOns}
            availableAddOns={availableAddOns}
            addOnsTotal={addOnsTotal}
            totalPrice={totalPrice}
            taxDetails={taxData}
            isProcessing={isProcessing || isProcessingBuyNewPlan}
            isCalculatingTax={isCalculatingTax}
            canCheckout={!!selectedPaymentMethodId && !!stripePriceId}
            onCheckout={handleSubmit(handleCheckout)}
            onManageCards={() => setIsModalOpen(true)}

          />
        </div>
        {isModalOpen && (
          <StripeWrapper
            orgId={atob(orgId as string)}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;
