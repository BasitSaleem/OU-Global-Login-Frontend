"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Input, Button, LoadingSpinner, Dots } from "@/components/ui";
import { SubdomainSuggestion } from "@/components/SubdomainSuggestion";
import { AvailabilityStatus } from "@/components/AvailabilityStatus";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";
import { PRODUCTS } from "@/constants";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { ChevronLeft, ChevronRight, Store, Factory, ShoppingCart, Layers, ArrowLeft } from "lucide-react";
import PlanSelectionCard from "./PlanSelectionCard";
import PlanCardSkeleton from "@/components/PlanCardSkeleton";
import Link from "next/link";

interface SetupStepProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  selectedProduct: string;
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
  selectedProduct,
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
}) => {
  const { data: plansData, isPending: loadingPlans } = useGetAllPlans();
  const [activeType, setActiveType] = useState<string>("RETAIL");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(initialBillingCycle);
  const [planPage, setPlanPage] = useState(0);
  const [showFullPlanSelection, setShowFullPlanSelection] = useState(false);

  const isDirectPlanView = isDirectFlow && !showFullPlanSelection;

  useEffect(() => {
    if (isDirectFlow && selectedPlanId && plansData?.plans) {
      const selectedPlan = plansData.plans.find(p => p.id === selectedPlanId);
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
        const aLevel = packageOrder.findIndex((p) => aName.includes(p));
        const bLevel = packageOrder.findIndex((p) => bName.includes(p));
        return aLevel - bLevel;
      });
  }, [plansData?.plans, activeType]);
  const nextPlan = () => {
    if (!filteredPlans.length) return;
    if (isDirectPlanView) {
      const currentIndex = filteredPlans.findIndex((p) => p.id === selectedPlanId);
      const nextIndex = (currentIndex + 1) % filteredPlans.length;
      setSelectedPlanId(filteredPlans[nextIndex].id);
    } else {
      const maxPage = Math.ceil(filteredPlans.length / 3) - 1;
      if (planPage < maxPage) setPlanPage(prev => prev + 1);
    }
  };

  const prevPlan = () => {
    if (!filteredPlans.length) return;
    if (isDirectPlanView) {
      const currentIndex = filteredPlans.findIndex((p) => p.id === selectedPlanId);
      const prevIndex = (currentIndex - 1 + filteredPlans.length) % filteredPlans.length;
      setSelectedPlanId(filteredPlans[prevIndex].id);
    } else {
      if (planPage > 0) setPlanPage(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-4 ">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold text-text mb-2">Setup Your Workspace</h2>
        <p className="text-text-secondary">Configure your domain and choose a plan for each product</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-text">Selected Products</label>
        <div className="flex flex-wrap gap-3">
          {PRODUCTS.map((product) => {
            const isSelected = selectedProduct === product.name;
            return (
              <div
                key={product.name}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border-border border transition-all ${isSelected
                  ? " bg-primary/5 text-primary"
                  : "border-gray-100 bg-white text-gray-500 opacity-60 grayscale hidden"
                  }`}
              >
                <SvgIcon name={product.icon} className="w-5 h-5" />
                <span className="font-bold text-sm whitespace-nowrap">Owners {product.fullname.split(' ')[1]}</span>
              </div>
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
              className="w-full px-6 bg-background py-5 rounded-xl focus:border-primary focus:ring-0 transition-all font-medium pr-24"
            />

          </div>
        </div>
      )}

      {selectedProduct === "OI" && (
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
              className="w-full px-6 bg-background py-5  rounded-xl focus:border-primary focus:ring-0 transition-all font-medium pr-24"
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
      )}

      <div className="space-y-2">
        <div className="space-y-0">
          <div className={`flex w-full ${isDirectPlanView ? "flex-col" : "flex-row"}`}>
            <p className="text-text pb-1 text-nowrap font-semibold pr-2">{isDirectPlanView ? "Your Selected Plan" : "Pricing"}</p>
            <div className="flex justify-between w-full items-center gap-2">
              <span className="text-text font-medium text-sm">
                {isDirectPlanView
                  ? `${activeType.charAt(0) + activeType.slice(1).toLowerCase()}`
                  : `(${typeData.findIndex(t => t.id === activeType) + 1}/${typeData.length})`}

              </span>
              {isDirectPlanView && (
                <span className="text-text text-xs font-medium">{billingCycle === 'yearly' ? 'Yearly Billing' : 'Monthly Billing'}</span>
              )}
            </div>
            {!isDirectPlanView && (
              <Link href="https://ownersinventory.com/pricing" target="_blank" className="text-primary cursor-pointer text-nowrap text-sm font-bold hover:underline">View all packages</Link>
            )}

          </div>
        </div>

        {!isDirectPlanView && (
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100/80 rounded-2xl w-fit">
              {typeData.map((type) => {
                const Icon = type.icon;
                const isActive = activeType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setActiveType(type.id);
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer transition-all ${isActive ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-gray-700"
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
                <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-text' : 'text-gray-400'}`}>Monthly</span>
                <div
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-[#1AD1B9]' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-bg-secondary rounded-full shadow-sm transition-all duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-text' : 'text-gray-400'}`}>Yearly</span>
              </div>
            </div>
          </div>
        )}

        <div className="relative group">
          {loadingPlans ? (
            <div className={!isDirectPlanView ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "w-full"}>
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
              {(isDirectPlanView ? filteredPlans.length > 3 : filteredPlans.length > 1) && (
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
                    disabled={!isDirectPlanView && planPage >= Math.ceil(filteredPlans.length / 3) - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 -mr-12 cursor-pointer bg-primary/40 rounded-full py-8 text-white disabled:opacity-0"
                  >
                    <ChevronRight size={40} />
                  </Button>
                </>
              )}
              <div className={!isDirectPlanView ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "w-full"}>
                {filteredPlans
                  .filter(plan => isDirectPlanView ? plan.id === selectedPlanId : true)
                  .slice(isDirectPlanView ? 0 : planPage * 3, isDirectPlanView ? 1 : (planPage + 1) * 3)
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
      <div className={`${isDirectFlow ? "flex justify-end" : "flex justify-between gap-4"} pt-4`}>
        {!isDirectFlow && (
          <Button
            variant="secondary"
            onClick={onBack}
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
        >
          {creatingOrg ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size={4} className="border-white" />
              <span>
                Creating<Dots />
              </span>
            </div>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div >
  );
};
