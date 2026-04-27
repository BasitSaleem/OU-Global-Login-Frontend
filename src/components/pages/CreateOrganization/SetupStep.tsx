"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Input, Button, LoadingSpinner, Dots } from "@/components/ui";
import { SubdomainSuggestion } from "@/components/SubdomainSuggestion";
import { AvailabilityStatus } from "@/components/AvailabilityStatus";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";
import { PRODUCTS } from "@/constants";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Store, Factory, ShoppingCart, Layers } from "lucide-react";
import PlanSelectionCard from "./PlanSelectionCard";
import PricingSkeleton from "@/components/PricingSkeleton";

interface SetupStepProps {
  companyName: string;
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
}

const typeData = [
  { id: "RETAIL", label: "Retail", icon: Store },
  { id: "MANUFACTURING", label: "Manufacturing", icon: Factory },
  { id: "ECOMMERCE", label: "Ecommerce", icon: ShoppingCart },
  { id: "HYBRID", label: "Hybrid", icon: Layers },
];

export const SetupStep: React.FC<SetupStepProps> = ({
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
}) => {
  const { data: plansData, isPending: loadingPlans } = useGetAllPlans();
  const [activeType, setActiveType] = useState<string>("RETAIL");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const CARD_WIDTH = 300;
  const GAP = 16;
  const TOTAL_MOVE = CARD_WIDTH + GAP;

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

  const maxIndex = Math.max(0, filteredPlans.length - 1);

  const handleNextPlan = () => currentIndex < maxIndex && setCurrentIndex(prev => prev + 1);
  const handlePrevPlan = () => currentIndex > 0 && setCurrentIndex(prev => prev - 1);

  const productInfo = PRODUCTS.find(p => p.name === selectedProduct);

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-text mb-2">Setup Your Workspace</h2>
        <p className="text-gray-500">Configure your domain and choose a plan for each product</p>
      </div>

      {/* Selected Products */}
      <div className="space-y-3">
        <label className="block text-base font-semibold text-text">Selected Products</label>
        <div className="flex flex-wrap gap-2">
          {productInfo && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium">
              <SvgIcon name={productInfo.icon} className="w-5 h-5" />
              {productInfo.fullname}
            </div>
          )}
        </div>
      </div>

      {/* Subdomain */}
      {selectedProduct === "OI" && (
        <div className="space-y-2">
          <Input
            isRequired
            type="text"
            label="Sub-Domain Name"
            value={subDomain}
            onChange={(e) =>
              setSubDomain(
                e.target.value
                  .toLocaleLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]/g, ""),
              )
            }
            disabled={fetchingSubdomainSuggestions}
            placeholder="Enter sub-domain"
            className="py-6"
          />

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

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="text-base font-semibold text-text">Pricing Plan</label>
          <div className="flex items-center gap-2 p-1 bg-gray-100  rounded-xl">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${billingCycle === "monthly" ? "bg-white shadow-sm text-primary" : "text-gray-500"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${billingCycle === "yearly" ? "bg-white shadow-sm text-primary" : "text-gray-500"
                }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
          {typeData.map((type) => {
            const Icon = type.icon;
            const isActive = activeType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => {
                  setActiveType(type.id);
                  setCurrentIndex(0);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all ${isActive ? "bg-primary text-white shadow-md" : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{type.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative group " ref={containerRef}>
          {currentIndex > 0 && (
            <Button
              variant="basic"
              leftIcon={<ChevronLeft size={24} />}
              onClick={handlePrevPlan}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white rounded-full px-1"
            >
            </Button>
          )}

          {currentIndex < maxIndex && (
            <Button
              variant="basic"
              rightIcon={<ChevronRight size={24} />}
              onClick={handleNextPlan}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white rounded-full px-1"
            >
            </Button>
          )}

          <div className="w-full ">
            {loadingPlans ? (
              <div className="flex gap-4">
                <PricingSkeleton />
                <PricingSkeleton className="hidden md:block" />
              </div>
            ) : (
              <motion.div
                className="flex gap-4"
                animate={{ x: -currentIndex * TOTAL_MOVE }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {filteredPlans.map((plan) => (
                  <div key={plan.id} className="shrink-0 w-[300px] max-w-full">
                    <PlanSelectionCard
                      plan={plan}
                      isSelected={selectedPlanId === plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      billingCycle={billingCycle}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-4 pt-6 border-t">
        <Button
          variant="secondary"
          className="px-8 py-6 rounded-xl font-bold"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          variant="primary"
          className="px-8 py-6 rounded-xl font-bold min-w-[150px]"
          onClick={onCreate}
          disabled={!canSubmit || creatingOrg}
        >
          {creatingOrg ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size={4} className="border-white" />
              <span>Creating<Dots /></span>
            </div>
          ) : (
            "Create Organization"
          )}
        </Button>
      </div>
    </div>
  );
};
