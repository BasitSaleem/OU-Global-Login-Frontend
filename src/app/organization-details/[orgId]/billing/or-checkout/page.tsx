"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Zap } from "lucide-react";

import {
  useOrBillingQuote,
  useOrBillingState,
  useOrBuyCredits,
  useOrCheckout,
} from "@/apiHooks.ts/orBilling/orBilling.api";
import { OrBillingAddress, OrPackLine } from "@/apiHooks.ts/orBilling/orBilling.types";
import { useGetPaymentMethods } from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import { useGetBillingInfo } from "@/apiHooks.ts/billing/billing.api";
import { PaymentMethod } from "@/apiHooks.ts/paymentMethod/paymentMethod.types";
import { InvoiceCountry, PaymentMethodSelector } from "@/components/pages/Checkout";
import { CheckoutFormValues } from "@/components/pages/Checkout/InvoiceCountry";
import CheckoutHeader from "@/components/pages/Checkout/CheckoutHeader";
import CheckOutSkeleton from "@/components/pages/Checkout/CheckOutSkeleton";
import OrOrderSummary, { OrSummaryLine } from "@/components/pages/Checkout/OrOrderSummary";
import BillingCycleToggle, {
  BillingCycle,
} from "@/components/pages/OrganizationDetails/Billing/BillingCycleToggle";
import StripeWrapper from "@/components/pages/OrganizationDetails/PaymentMethods/StripeWrapper";
import PaymentSuccessModal from "@/components/modals/PaymentSuccessModal";
import { Button } from "@/components/ui";
import { checkoutSchema } from "@/schemas/checkout.schemas";
import logger from "@/utils/logger";

const usd = (minor: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(minor / 100);

function OrCheckoutPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "credits" ? "credits" : "plan";
  const planId = searchParams.get("plan");
  const initialPack = searchParams.get("pack");

  const [cycle, setCycle] = useState<BillingCycle>(
    searchParams.get("cycle") === "yearly" ? "yearly" : "monthly",
  );
  const [packs, setPacks] = useState<Record<string, number>>(
    initialPack ? { [initialPack]: 1 } : {},
  );
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [isCardsModalOpen, setIsCardsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [highlightBilling, setHighlightBilling] = useState(false);

  const { data: state, isPending: loadingState } = useOrBillingState(orgId);
  const { data: paymentMethodsData, isPending: loadingPaymentMethods } =
    useGetPaymentMethods(orgId);
  const { data: billingInfo, isPending: loadingBillingInfo } = useGetBillingInfo();
  const { mutate: getQuote, data: quote, isPending: isCalculating, reset: resetQuote } =
    useOrBillingQuote(orgId);
  const { mutateAsync: checkout, isPending: isCheckingOut } = useOrCheckout(orgId);
  const { mutateAsync: buyCredits, isPending: isBuyingCredits } = useOrBuyCredits(orgId);

  const paymentMethods: PaymentMethod[] = paymentMethodsData?.paymentMethods || [];
  const subscription = state?.subscription ?? null;
  const isPaid =
    !!subscription &&
    !subscription.isTrial &&
    (subscription.status === "ACTIVE" || subscription.status === "PAST_DUE");
  const isUpgrade = mode === "plan" && isPaid;
  const plan = state?.offers?.plans.find((p) => p.planId === planId);
  const yearlyAvailable = !!plan && plan.yearlyPriceMinor !== null;
  // An upgrade keeps the current billing cycle (switching is a later step).
  const lockedCycle: BillingCycle | null = isUpgrade
    ? subscription!.billingCycle === "YEARLY"
      ? "yearly"
      : "monthly"
    : !yearlyAvailable
      ? "monthly"
      : null;
  const effectiveCycle = lockedCycle ?? cycle;

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
  useEffect(() => {
    if (watchFields.country && watchFields.country !== "US") {
      setValue("billing_address", "");
      setValue("billing_city", "");
      setValue("billing_state", "");
      setValue("billing_postal_code", "");
    }
  }, [watchFields.country, setValue]);

  useEffect(() => {
    if (!selectedPaymentMethodId && paymentMethods.length > 0) {
      const primary = paymentMethods.find((m) => m.is_primary);
      setSelectedPaymentMethodId(primary?.id || paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  const packLines: OrPackLine[] = useMemo(
    () =>
      Object.entries(isUpgrade ? {} : packs)
        .filter(([, quantity]) => quantity > 0)
        .map(([packId, quantity]) => ({ packId, quantity })),
    [packs, isUpgrade],
  );

  const address = (values: CheckoutFormValues): OrBillingAddress => ({
    country: values.country,
    ...(values.country === "US" && {
      billing_address: values.billing_address,
      billing_city: values.billing_city,
      billing_state: values.billing_state,
      billing_postal_code: values.billing_postal_code,
    }),
  });

  const addressComplete =
    !!watchFields.country &&
    (watchFields.country !== "US" ||
      (!!watchFields.billing_state &&
        !!watchFields.billing_postal_code &&
        !!watchFields.billing_address &&
        !!watchFields.billing_city));
  const hasItems = mode === "plan" ? !!plan : packLines.length > 0;

  // Debounced server quote (tax, and proration for upgrades).
  useEffect(() => {
    if (!addressComplete || !hasItems) {
      resetQuote();
      return;
    }
    const timer = setTimeout(() => {
      getQuote({
        ...address(watchFields),
        packs: packLines,
        ...(mode === "plan" && plan
          ? {
              planId: plan.planId,
              billingCycle: effectiveCycle === "yearly" ? "YEARLY" : "MONTHLY",
            }
          : {}),
      });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addressComplete,
    hasItems,
    mode,
    plan?.planId,
    effectiveCycle,
    packLines,
    watchFields.country,
    watchFields.billing_state,
    watchFields.billing_postal_code,
    watchFields.billing_city,
    watchFields.billing_address,
  ]);

  const lines: OrSummaryLine[] = useMemo(() => {
    const out: OrSummaryLine[] = [];
    if (mode === "plan" && plan)
      out.push({
        label: `Owners Reach ${plan.name}`,
        detail: `${effectiveCycle === "yearly" ? "Yearly" : "Monthly"} · ${plan.includedCredits.toLocaleString("en-US")} credits every month`,
        amountMinor:
          effectiveCycle === "yearly" ? plan.yearlyPriceMinor! : plan.monthlyPriceMinor,
      });
    for (const line of packLines) {
      const pack = state?.offers?.packs.find((p) => p.packId === line.packId);
      if (pack)
        out.push({
          label: `${pack.credits.toLocaleString("en-US")} credits × ${line.quantity}`,
          detail: "One-time credit pack, never expires",
          amountMinor: pack.priceMinor * line.quantity,
        });
    }
    return out;
  }, [mode, plan, effectiveCycle, packLines, state?.offers?.packs]);

  const setPackQuantity = (packId: string, quantity: number) =>
    setPacks((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[packId];
      else next[packId] = Math.min(20, quantity);
      return next;
    });

  const onCheckout = handleSubmit(async (values) => {
    if (!selectedPaymentMethodId) return;
    try {
      if (mode === "plan" && plan) {
        await checkout({
          ...address(values),
          planId: plan.planId,
          billingCycle: effectiveCycle === "yearly" ? "YEARLY" : "MONTHLY",
          packs: packLines,
          paymentMethodId: selectedPaymentMethodId,
        });
      } else {
        await buyCredits({
          ...address(values),
          packs: packLines,
          paymentMethodId: selectedPaymentMethodId,
        });
      }
      setIsSuccessModalOpen(true);
    } catch (error) {
      logger.error("Owners Reach checkout error:", error);
    }
  });

  const scrollToBilling = () => {
    document
      .getElementById("billing-info-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setHighlightBilling(true);
    setTimeout(() => setHighlightBilling(false), 2000);
  };

  if (loadingState || loadingPaymentMethods || loadingBillingInfo) return <CheckOutSkeleton />;

  const unavailable =
    !state?.offers ||
    (mode === "plan" && !plan) ||
    (mode === "credits" && !state.canBuyCredits);
  if (unavailable) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-bg-secondary border rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold">
            {mode === "credits" ? "Credit packs unavailable" : "Plan not found"}
          </h2>
          <p className="text-text text-sm">
            {mode === "credits"
              ? "Credit packs can be bought during an active paid plan. Choose a plan first; you can add credit packs at checkout."
              : "This plan is no longer available. Go back and choose a current plan."}
          </p>
          <Button
            variant="primary"
            onClick={() => router.push(`/organization-details/${orgId}/billing?product=lead`)}
          >
            Back to Billing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto md:px-8 pb-60">
      <CheckoutHeader
        title={mode === "credits" ? "Buy credits" : isUpgrade ? "Upgrade plan" : "Checkout"}
        description={
          mode === "credits"
            ? "Add credits to Owners Reach. Purchased credits never expire."
            : "Review your Owners Reach plan and complete your purchase."
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {mode === "plan" && plan && (
            <div className="bg-bg-secondary border rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-text">Owners Reach {plan.name}</h2>
                  <p className="text-sm text-text-secondary">
                    {plan.includedCredits.toLocaleString("en-US")} credits every month ·{" "}
                    {plan.seats} {plan.seats === 1 ? "seat" : "seats"} · {plan.concurrentRuns}{" "}
                    concurrent {plan.concurrentRuns === 1 ? "run" : "runs"}
                  </p>
                </div>
                {!lockedCycle && (
                  <BillingCycleToggle
                    value={cycle}
                    onChange={setCycle}
                    savingLabel={
                      plan.yearlyPriceMinor !== null && plan.monthlyPriceMinor > 0
                        ? `Save ${Math.max(0, Math.round((1 - plan.yearlyPriceMinor / (plan.monthlyPriceMinor * 12)) * 100))}%`
                        : "Yearly"
                    }
                  />
                )}
              </div>
              <p className="text-2xl font-bold text-text">
                {usd(effectiveCycle === "yearly" ? plan.yearlyPriceMinor! : plan.monthlyPriceMinor)}
                <span className="text-sm font-medium text-text-secondary">
                  {effectiveCycle === "yearly" ? " /year" : " /month"}
                </span>
              </p>
              <p className="text-xs text-text-secondary">
                Monthly credits refresh every month and do not carry over.
                {effectiveCycle === "yearly" && " On yearly billing you still receive them every month."}
                {subscription?.isTrial && " Buying a plan ends your free trial; plan credits replace any trial credits left."}
              </p>
            </div>
          )}

          {/* An upgrade is billed on its own; credit packs are bought separately after it. */}
          {(state.offers?.packs.length ?? 0) > 0 && !isUpgrade && (
            <div className="bg-bg-secondary border rounded-xl p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-text">
                  {mode === "credits" ? "Credit packs" : "Add credit packs (optional)"}
                </h2>
                <p className="text-sm text-text-secondary">
                  One-time purchase. Purchased credits never expire and are used after your
                  monthly credits.
                </p>
              </div>
              <div className="space-y-3">
                {state.offers!.packs.map((pack) => {
                  const quantity = packs[pack.packId] ?? 0;
                  return (
                    <div
                      key={pack.packId}
                      className="flex items-center justify-between gap-3 border border-border rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={18} className="text-primary" />
                        <div>
                          <p className="text-sm font-semibold text-text">
                            {pack.credits.toLocaleString("en-US")} credits
                          </p>
                          <p className="text-xs text-text-secondary">{usd(pack.priceMinor)} each</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Fewer ${pack.credits} credit packs`}
                          disabled={quantity === 0}
                          onClick={() => setPackQuantity(pack.packId, quantity - 1)}
                          className="p-1.5 rounded-md border border-border disabled:opacity-40 cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
                        <button
                          type="button"
                          aria-label={`More ${pack.credits} credit packs`}
                          disabled={quantity >= 20}
                          onClick={() => setPackQuantity(pack.packId, quantity + 1)}
                          className="p-1.5 rounded-md border border-border disabled:opacity-40 cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div
            id="billing-info-section"
            className={`scroll-mt-24 transition-all duration-500 ${highlightBilling ? "ring-1 ring-red-400 rounded-xl" : ""}`}
          >
            <InvoiceCountry
              control={control}
              register={register}
              errors={formErrors}
              watchCountry={watchFields.country}
            />
          </div>

          <PaymentMethodSelector
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onSelectPaymentMethod={setSelectedPaymentMethodId}
            onManageCards={() => setIsCardsModalOpen(true)}
            orgId={orgId}
          />
        </div>

        <div className="lg:col-span-1 self-start sticky top-10 z-10">
          <OrOrderSummary
            title={mode === "credits" ? "Credits summary" : "Order summary"}
            lines={lines}
            quote={quote}
            isCalculating={isCalculating}
            hasCountry={addressComplete}
            isPaymentMethodAvailable={paymentMethods.length > 0}
            canCheckout={!!selectedPaymentMethodId && hasItems}
            isProcessing={isCheckingOut || isBuyingCredits}
            checkoutLabel={
              mode === "credits" ? "Buy credits" : isUpgrade ? "Upgrade now" : "Subscribe"
            }
            note={
              mode === "plan"
                ? "Your plan renews automatically. Cancel any time from Billing; you keep access until the period ends."
                : undefined
            }
            onCheckout={onCheckout}
            onManageCards={() => setIsCardsModalOpen(true)}
            onAddBillingInfo={scrollToBilling}
          />
        </div>
      </div>

      {isCardsModalOpen && (
        <StripeWrapper orgId={orgId} onClose={() => setIsCardsModalOpen(false)} />
      )}
      <PaymentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        planName={mode === "credits" ? "Owners Reach credits" : `Owners Reach ${plan?.name ?? ""}`}
        message={
          mode === "credits"
            ? "Thanks for your purchase. Your credit pack is paid."
            : `Thanks for your purchase. Your Owners Reach ${plan?.name ?? ""} plan is now active.`
        }
        note="Credits can take up to a minute to appear in Owners Reach. Please wait a moment before starting a pipeline."
        redirectTo={`/organization-details/${orgId}/billing?product=lead`}
      />
    </div>
  );
}

export default OrCheckoutPage;
