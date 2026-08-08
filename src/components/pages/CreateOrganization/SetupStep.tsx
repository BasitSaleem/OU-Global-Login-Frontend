"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Input, Button, LoadingSpinner, Dots } from "@/components/ui";
import { SubdomainSuggestion } from "@/components/SubdomainSuggestion";
import { AvailabilityStatus } from "@/components/AvailabilityStatus";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";
import { useGetOpPackages } from "@/apiHooks.ts/opPackages/opPackages.api";
import { PRODUCTS } from "@/constants";
import { SvgIcon } from "@/components/ui/SvgIcon";
import {
  ChevronLeft,
  ChevronRight,
  Store,
  Factory,
  ShoppingCart,
  Layers,
  ArrowLeft,
  Check,
} from "lucide-react";
import PlanSelectionCard from "./PlanSelectionCard";
import PlanCardSkeleton from "@/components/PlanCardSkeleton";
import OpServicesSelector from "./OpServicesSelector";
import Link from "next/link";

// Owners Pulse tier picker — shown in the OP configuration block when the "Plans"
// mode is active. OP has 3 simple tiers, each with a 14-day free trial (GHL
// bills OP; the setup fee is arranged separately with the team). GHL's own
// SaaS Mode requires a card on file to keep a sub-account off its paywall —
// the trial only delays the charge, it doesn't waive card collection — and
// that card step is handled natively on GHL's side, not by this app.
// Uses its OWN opPackageId state (distinct from the OI selectedPlanId) so the two
// products don't collide when both are selected.
const OpTierSelection: React.FC<{
  opPackageId: string | null;
  setOpPackageId: (val: string | null) => void;
  billingCycle: "monthly" | "yearly";
}> = ({ opPackageId, setOpPackageId, billingCycle }) => {
  const { data: packages, isPending } = useGetOpPackages();

  // opPackageId starts null; default to the first tier so a valid OP tier is
  // always sent once packages load.
  useEffect(() => {
    if (packages && packages.length > 0) {
      const isValidOpSelection = packages.some((p) => p.id === opPackageId);
      if (!isValidOpSelection) {
        setOpPackageId(packages[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packages]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-text font-semibold">Choose your plan</p>
        <span className="text-xs font-medium text-text-secondary">
          14-day free trial
        </span>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlanCardSkeleton />
          <PlanCardSkeleton />
          <PlanCardSkeleton />
        </div>
      ) : !packages || packages.length === 0 ? (
        <p className="text-sm text-text-secondary py-6 text-center">
          No plans available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const isSelected = opPackageId === pkg.id;
            const showYearly = billingCycle === "yearly" && !!pkg.yearly_price;
            const priceVal = showYearly ? pkg.yearly_price : pkg.monthly_price;
            return (
              <button
                type="button"
                key={pkg.id}
                onClick={() => setOpPackageId(pkg.id)}
                className={`relative text-left p-5 rounded-xl border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-text capitalize">
                    {pkg.name}
                  </span>
                  {isSelected && <Check size={16} className="text-primary" />}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-text">
                    ${priceVal}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {showYearly ? "/yr" : "/mo"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  {pkg.trial_days}-day free trial
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SetupStepProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  selectedProducts: string[];
  subDomain: string;
  setSubDomain: (val: string) => void;
  suggestions: string[] | undefined;
  fetchingSubdomainSuggestions: boolean;
  handleSuggestionClick: (suggestion: string) => void;
  checkingSub: boolean;
  finalIsSubAvailable: boolean | undefined;
  isSubDomainDebouncing: boolean;
  selectedPlanId: string | null;
  setSelectedPlanId: (val: string | null) => void;
  onBack: () => void;
  onCreate: () => void;
  creatingOrg: boolean;
  canSubmit: boolean;
  isDirectFlow?: boolean;
  initialBillingCycle?: "monthly" | "yearly";
  // Owners Pulse: choose between a standalone plan (trial) and a done-for-you
  // services order. OP uses its own opPackageId (distinct from the OI plan).
  opPackageId?: string | null;
  setOpPackageId?: (val: string | null) => void;
  opMode?: "plan" | "services";
  setOpMode?: (m: "plan" | "services") => void;
  opServiceIds?: string[];
  setOpServiceIds?: (ids: string[]) => void;
  opDominationUpgrade?: boolean;
  setOpDominationUpgrade?: (v: boolean) => void;
  opInvoiceId?: string;
  setOpInvoiceId?: (v: string) => void;
  opInvoiceVerified?: boolean;
  setOpInvoiceVerified?: (v: boolean) => void;
}

const typeData = [
  { id: "RETAIL", label: "Retail", icon: Store },
  { id: "MANUFACTURING", label: "Manufacturing", icon: Factory },
  { id: "ECOMMERCE", label: "Ecommerce", icon: ShoppingCart },
  { id: "HYBRID", label: "Hybrid", icon: Layers },
];

export const SetupStep: React.FC<SetupStepProps> = ({
  companyName,
  setCompanyName,
  selectedProducts,
  subDomain,
  setSubDomain,
  suggestions,
  fetchingSubdomainSuggestions,
  handleSuggestionClick,
  checkingSub,
  finalIsSubAvailable,
  isSubDomainDebouncing,
  selectedPlanId,
  setSelectedPlanId,
  onBack,
  onCreate,
  creatingOrg,
  canSubmit,
  isDirectFlow = false,
  initialBillingCycle = "monthly",
  opPackageId = null,
  setOpPackageId,
  opMode = "plan",
  setOpMode,
  opServiceIds = [],
  setOpServiceIds,
  opDominationUpgrade = false,
  setOpDominationUpgrade,
  opInvoiceId = "",
  setOpInvoiceId,
  opInvoiceVerified = false,
  setOpInvoiceVerified,
}) => {
  const { data: plansData, isPending: loadingPlans } = useGetAllPlans();
  const [activeType, setActiveType] = useState<string>("RETAIL");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    initialBillingCycle,
  );
  const [planPage, setPlanPage] = useState(0);
  const [showFullPlanSelection, setShowFullPlanSelection] = useState(false);

  const isOiSelected = selectedProducts.includes("OI");
  const isOpSelected = selectedProducts.includes("OP");

  // Mirrors the parent's canSubmit() priority order so the tooltip always
  // names the SAME condition that's actually blocking Create — not a guess.
  const disabledReason = (() => {
    if (!companyName.trim()) return "Enter an organization name to continue.";
    if (selectedProducts.length === 0) return "Select at least one product.";
    if (isOiSelected) {
      if (!subDomain.trim()) return "Enter a sub-domain for Owners Inventory.";
      if (isSubDomainDebouncing || checkingSub)
        return "Checking sub-domain availability…";
      if (finalIsSubAvailable === false)
        return "This sub-domain is unavailable — choose another.";
      if (!selectedPlanId) return "Choose an Owners Inventory plan.";
    }
    if (isOpSelected) {
      if (opMode === "services") {
        if (opServiceIds.length === 0)
          return "Select at least one Owners Pulse service.";
        if (!opInvoiceVerified)
          return "Verify your Owners Pulse invoice ID to continue.";
      } else if (!opPackageId) {
        return "Choose an Owners Pulse plan.";
      }
    }
    return undefined;
  })();

  // Step 2 shows ONE product's config at a time; the Selected Products chips act
  // as tabs. Default to the first selected product (in PRODUCTS order), and keep
  // the active tab valid as the selection changes.
  const orderedSelected = useMemo(
    () =>
      PRODUCTS.filter((p) => selectedProducts.includes(p.name)).map(
        (p) => p.name,
      ),
    [selectedProducts],
  );
  const [activeProduct, setActiveProduct] = useState<string>(
    orderedSelected[0] ?? "",
  );
  useEffect(() => {
    if (!activeProduct || !selectedProducts.includes(activeProduct)) {
      setActiveProduct(orderedSelected[0] ?? "");
    }
  }, [orderedSelected, activeProduct, selectedProducts]);

  const isDirectPlanView = isDirectFlow && !showFullPlanSelection;

  useEffect(() => {
    if (isDirectFlow && selectedPlanId && plansData?.plans) {
      const selectedPlan = plansData.plans.find((p) => p.id === selectedPlanId);
      if (selectedPlan) {
        setActiveType(selectedPlan.type);
      }
    }
  }, [isDirectFlow, selectedPlanId, plansData]);
  useEffect(() => {
    setPlanPage(0);
  }, [activeType]);

  const filteredPlans = useMemo(() => {
    if (!plansData?.plans) return [];
    const packageOrder = ["BASIC", "PRO", "PREMIUM"];
    return [...plansData.plans]
      .filter((plan) => plan.type === activeType)
      .sort((a, b) => {
        const aName = a.package_name.toUpperCase();
        const bName = b.package_name.toUpperCase();

        if (activeType === "HYBRID") {
          const getHybridOrder = (name: string) => {
            if (name.includes("BUSINESS")) return 0;
            if (name.includes("ENTERPRISE")) return 1;
            if (name.includes("PRO CATEGORY")) return 2;
            if (name.includes("PRO")) return 3;
            return 4;
          };

          return getHybridOrder(aName) - getHybridOrder(bName);
        }

        const aLevel = packageOrder.findIndex((p) => aName.includes(p));
        const bLevel = packageOrder.findIndex((p) => bName.includes(p));
        return aLevel - bLevel;
      });
  }, [plansData?.plans, activeType]);
  const nextPlan = () => {
    if (!filteredPlans.length) return;
    if (isDirectPlanView) {
      const currentIndex = filteredPlans.findIndex(
        (p) => p.id === selectedPlanId,
      );
      const nextIndex = (currentIndex + 1) % filteredPlans.length;
      setSelectedPlanId(filteredPlans[nextIndex].id);
    } else {
      const maxPage = Math.ceil(filteredPlans.length / 3) - 1;
      if (planPage < maxPage) setPlanPage((prev) => prev + 1);
    }
  };

  const prevPlan = () => {
    if (!filteredPlans.length) return;
    if (isDirectPlanView) {
      const currentIndex = filteredPlans.findIndex(
        (p) => p.id === selectedPlanId,
      );
      const prevIndex =
        (currentIndex - 1 + filteredPlans.length) % filteredPlans.length;
      setSelectedPlanId(filteredPlans[prevIndex].id);
    } else {
      if (planPage > 0) setPlanPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* <div className="text-center md:text-left">
        <h2 className="text-xl font-bold text-text mb-2">Setup Your Workspace</h2>
        <p className="text-text-secondary">Configure your domain and choose a plan for each product</p>
      </div> */}

      <div className="space-y-2 py-4">
        <label className="block text-sm font-bold text-text">Products</label>
        <div className="flex flex-wrap gap-3">
          {PRODUCTS.filter((product) =>
            selectedProducts.includes(product.name),
          ).map((product) => {
            const isActive = activeProduct === product.name;
            return (
              <button
                type="button"
                key={product.name}
                onClick={() => setActiveProduct(product.name)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border bg-background text-text-secondary hover:text-text"
                }`}
              >
                <SvgIcon name={product.icon} className="w-5 h-5" />
                <span className="font-bold text-sm whitespace-nowrap">
                  Owners {product.fullname.split(" ")[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {isDirectFlow && (
        <div className="space-y-0">
          <div className="relative group">
            <Input
              type="text"
              label="Organization Name"
              value={companyName}
              isRequired
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter organization name"
              className="w-full px-4 bg-background py-3 rounded-xl focus:border-primary focus:ring-0 transition-all font-medium pr-24"
            />
          </div>
        </div>
      )}

      {/* Owners Inventory configuration: subdomain + OI plan cards */}
      {isOiSelected && activeProduct === "OI" && (
        <div className="space-y-4">
          {!isDirectFlow && (
            <h3 className="text-base font-bold text-text">Owners Inventory</h3>
          )}

          <div className="space-y-0">
            <div className="relative group">
              <Input
                type="text"
                label="Sub-Domain Name"
                value={subDomain}
                isRequired
                onChange={(e) =>
                  setSubDomain(
                    e.target.value
                      .toLocaleLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]/g, ""),
                  )
                }
                disabled={fetchingSubdomainSuggestions}
                placeholder="Enter Sub-Domain"
                className="w-full px-4 bg-background py-3 rounded-xl focus:border-primary focus:ring-0 transition-all font-medium pr-24"
              />
            </div>

            <SubdomainSuggestion
              suggestions={suggestions!}
              onSuggestionClick={handleSuggestionClick}
              isLoading={fetchingSubdomainSuggestions}
            />

            <AvailabilityStatus
              isLoading={checkingSub}
              isAvailable={finalIsSubAvailable}
              isDebouncing={isSubDomainDebouncing}
              fieldName="Sub-domain"
              value={subDomain}
            />
          </div>

          <div className="space-y-2">
            <div className="space-y-0">
              <div
                className={`flex w-full ${isDirectPlanView ? "flex-col" : "flex-row"}`}
              >
                <p className="text-text pb-1 text-nowrap font-semibold pr-2">
                  {isDirectPlanView ? "Your Selected Plan" : "Pricing"}
                </p>
                <div className="flex justify-between w-full items-center gap-2">
                  <span className="text-text font-medium text-sm">
                    {isDirectPlanView
                      ? `${activeType.charAt(0) + activeType.slice(1).toLowerCase()}`
                      : `(${typeData.findIndex((t) => t.id === activeType) + 1}/${typeData.length})`}
                  </span>
                  {isDirectPlanView && (
                    <span className="text-text text-xs font-medium">
                      {billingCycle === "yearly"
                        ? "Yearly Billing"
                        : "Monthly Billing"}
                    </span>
                  )}
                </div>
                {!isDirectPlanView && (
                  <Link
                    href="https://ownersinventory.com/pricing"
                    target="_blank"
                    className="text-primary cursor-pointer text-nowrap text-sm font-bold hover:underline"
                  >
                    View all packages
                  </Link>
                )}
              </div>
            </div>

            {!isDirectPlanView && (
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-wrap gap-2 p-1.5 bg-ribbon rounded-2xl w-fit">
                  {typeData.map((type) => {
                    const Icon = type.icon;
                    const isActive = activeType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          setActiveType(type.id);
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isActive
                            ? "bg-primary text-white shadow-md"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="font-bold text-sm">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-6 pb-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold ${billingCycle === "monthly" ? "text-text" : "text-gray-400"}`}
                    >
                      Monthly
                    </span>
                    <div
                      onClick={() =>
                        setBillingCycle(
                          billingCycle === "monthly" ? "yearly" : "monthly",
                        )
                      }
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${billingCycle === "yearly" ? "bg-[#1AD1B9]" : "bg-gray-200"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-bg-secondary rounded-full shadow-sm transition-all duration-300 ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </div>
                    <span
                      className={`text-sm font-bold ${billingCycle === "yearly" ? "text-text" : "text-gray-400"}`}
                    >
                      Yearly
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="relative group">
              {loadingPlans ? (
                <div
                  className={
                    !isDirectPlanView
                      ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                      : "w-full"
                  }
                >
                  <PlanCardSkeleton />
                  {!isDirectPlanView && (
                    <>
                      <PlanCardSkeleton />
                      <PlanCardSkeleton />
                    </>
                  )}
                </div>
              ) : (
                <>
                  {(isDirectPlanView
                    ? filteredPlans.length > 3
                    : filteredPlans.length > 1) && (
                    <>
                      <Button
                        variant="basic"
                        onClick={prevPlan}
                        disabled={!isDirectPlanView && planPage === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 -ml-12 cursor-pointer bg-primary/40 rounded-full py-8 text-white disabled:opacity-0"
                      >
                        <ChevronLeft size={40} />
                      </Button>
                      <Button
                        variant="basic"
                        onClick={nextPlan}
                        disabled={
                          !isDirectPlanView &&
                          planPage >= Math.ceil(filteredPlans.length / 3) - 1
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 -mr-12 cursor-pointer bg-primary/40 rounded-full py-8 text-white disabled:opacity-0"
                      >
                        <ChevronRight size={40} />
                      </Button>
                    </>
                  )}
                  <div
                    className={
                      !isDirectPlanView
                        ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                        : "w-full"
                    }
                  >
                    {filteredPlans
                      .filter((plan) =>
                        isDirectPlanView ? plan.id === selectedPlanId : true,
                      )
                      .slice(
                        isDirectPlanView ? 0 : planPage * 3,
                        isDirectPlanView ? 1 : (planPage + 1) * 3,
                      )
                      .map((plan) => (
                        <PlanSelectionCard
                          key={plan.id}
                          plan={plan}
                          isSelected={selectedPlanId === plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          billingCycle={billingCycle}
                          isDirectFlow={isDirectPlanView}
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
            {isDirectPlanView && (
              <div className="mt-2">
                <span className="text-text text-sm">Not the right plan? </span>
                <span
                  onClick={() => setShowFullPlanSelection(true)}
                  className="text-primary text-sm font-bold hover:underline cursor-pointer"
                >
                  Change plan
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Owners Pulse configuration: plan (trial) vs done-for-you services */}
      {isOpSelected && activeProduct === "OP" && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-text">Owners Pulse</h3>

          {/* Plan (trial) vs Services  +  Monthly / Yearly toggle */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-wrap gap-2 p-1.5 bg-ribbon rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setOpMode?.("plan")}
                className={`px-5 py-2 rounded-xl cursor-pointer text-sm font-bold transition-all ${
                  opMode === "plan"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                Plans
              </button>
              <button
                type="button"
                onClick={() => setOpMode?.("services")}
                className={`px-5 py-2 rounded-xl cursor-pointer text-sm font-bold transition-all ${
                  opMode === "services"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                Done-For-You-Services
              </button>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${billingCycle === "monthly" ? "text-text" : "text-text-secondary"}`}
                >
                  Monthly
                </span>
                <div
                  onClick={() =>
                    setBillingCycle(
                      billingCycle === "monthly" ? "yearly" : "monthly",
                    )
                  }
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${billingCycle === "yearly" ? "bg-success" : "bg-card-secondary"}`}
                >
                  <div
                    className={`w-4 h-4 bg-bg-secondary rounded-full shadow-sm transition-all duration-300 ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"}`}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${billingCycle === "yearly" ? "text-text" : "text-text-secondary"}`}
                >
                  Yearly
                </span>
              </div>
            </div>
          </div>

          {opMode === "services" ? (
            <OpServicesSelector
              selectedServiceIds={opServiceIds}
              setSelectedServiceIds={(ids) => setOpServiceIds?.(ids)}
              dominationUpgrade={opDominationUpgrade}
              setDominationUpgrade={(v) => setOpDominationUpgrade?.(v)}
              billingCycle={billingCycle}
              invoiceId={opInvoiceId}
              setInvoiceId={(v) => setOpInvoiceId?.(v)}
              invoiceVerified={opInvoiceVerified}
              setInvoiceVerified={(v) => setOpInvoiceVerified?.(v)}
            />
          ) : (
            <OpTierSelection
              opPackageId={opPackageId}
              setOpPackageId={(val) => setOpPackageId?.(val)}
              billingCycle={billingCycle}
            />
          )}
        </div>
      )}

      <div
        className={`${isDirectFlow ? "flex justify-end" : "flex justify-between gap-4"} pt-4`}
      >
        {!isDirectFlow && (
          <Button
            variant="secondary"
            onClick={onBack}
            disabled={creatingOrg}
            leftIcon={<ArrowLeft size={16} />}
            className="mr-auto"
          >
            Back
          </Button>
        )}

        <Button
          variant="primary"
          onClick={onCreate}
          disabled={!canSubmit || creatingOrg}
          tooltip={!canSubmit && !creatingOrg ? disabledReason : undefined}
          tooltipPosition="top"
        >
          {creatingOrg ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size={4} className="border-white" />
              <span>
                Creating
                <Dots />
              </span>
            </div>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
};
