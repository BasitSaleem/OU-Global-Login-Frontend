import React, { useState } from "react";
import { Dropdown } from "@/components/ui";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";
import DropdownSkeleton from "@/components/ui/DropdownSkeleton";

interface OgPlanSelectorProps {
  selectedPlane: string | null;
  setSelectedPlan: (value: string | null) => void;
}

const OgPlanSelector = ({
  selectedPlane,
  setSelectedPlan,
}: OgPlanSelectorProps) => {
  const { data, isPending, error } = useGetAllPlans(1, 11);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allPlans = data?.plans || [];

  const categories = Array.from(new Set(allPlans.map((p) => p.type))).map(
    (type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
    }),
  );

  /** ✅ plans based on selected category */
  const plans =
    selectedCategory && allPlans.length > 0
      ? allPlans
          .filter((p) => p.type === selectedCategory)
          .map((plan) => ({
            value: plan.id,
            label: (
              <span className="flex items-center justify-between w-full overflow-hidden">
                <span className="truncate">{plan.package_name}</span>
                {plan.free_trial_days > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-full uppercase whitespace-nowrap shrink-0">
                    {plan.free_trial_days} Days Trial
                  </span>
                )}
              </span>
            ),
          }))
      : [];

  /**  loading state */
  if (isPending) {
    return (
      <div className="flex flex-col space-y-3">
        <DropdownSkeleton />
        <DropdownSkeleton />
      </div>
    );
  }

  /**  error state */
  if (error) {
    return (
      <div className="text-sm text-red-500">
        Failed to load plans. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <Dropdown
        label="Plan Categories"
        isRequired
        placeholder="Select a category"
        options={categories}
        value={selectedCategory ?? undefined}
        onChange={(val: string) => {
          setSelectedCategory(val);
          setSelectedPlan(null); // reset plan when category changes
        }}
      />

      <Dropdown
        label="Pricing Plans"
        isRequired
        placeholder={
          selectedCategory ? "Select a plan" : "Select category first"
        }
        options={plans}
        value={selectedPlane ?? undefined}
        onChange={setSelectedPlan}
        disabled={!selectedCategory}
      />
    </div>
  );
};

export default OgPlanSelector;
