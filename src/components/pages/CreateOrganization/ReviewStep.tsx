











"use client";
import React from "react";
import { Button, LoadingSpinner, Dots } from "@/components/ui";
import { PRODUCTS } from "@/constants";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";

interface ReviewStepProps {
  companyName: string;
  selectedProduct: string;
  subDomain: string;
  selectedPlanId: string | null;
  onBack: () => void;
  onCreate: () => void;
  creatingOrg: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  companyName,
  selectedProduct,
  subDomain,
  selectedPlanId,
  onBack,
  onCreate,
  creatingOrg,
}) => {
  const { data: plansData } = useGetAllPlans();
  const selectedPlan = plansData?.plans?.find(p => p.id === selectedPlanId);
  const productInfo = PRODUCTS.find(p => p.name === selectedProduct);

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-text mb-2">Setup Your Workspace</h2>
        <p className="text-gray-500">Configure your domain and review your selected plan</p>
      </div>

      <div className="space-y-6">
        {/* Selected Product */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text uppercase tracking-wider">Selected Products</label>
          <div className="flex">
            {productInfo && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium">
                <SvgIcon name={productInfo.icon} className="w-5 h-5" />
                {productInfo.fullname}
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase">Organization Name</label>
            <p className="text-lg font-bold text-text">{companyName}</p>
          </div>
          {selectedProduct === "OI" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Sub-Domain Name</label>
              <p className="text-lg font-bold text-text">{subDomain}.{process.env.NEXT_PUBLIC_DOMAIN_NAME || "ownersanalytics.com"}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-text font-bold">Your Selected Plan</label>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">
              {productInfo?.fullname} • <span className="text-text font-bold">{selectedPlan?.type}</span>
            </span>
            <button onClick={onBack} className="text-primary font-bold hover:underline">Change plan</button>
          </div>

          {selectedPlan && (
            <div className="px-5 py-4 bg-white border-2 border-primary/20 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-text">{selectedPlan.package_name}</h3>
                  <div className="w-3.5 h-3.5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                </div>
                <p className="text-gray-500 text-[11px]">Perfect for small businesses getting started</p>
                <div className="text-primary font-bold text-xs">Start 30-Day Free Trial</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">${selectedPlan.monthly_price}<span className="text-[10px] text-gray-400 font-normal">/month</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button
          variant="primary"
          className="px-12 py-6 rounded-xl font-bold text-lg min-w-[200px]"
          onClick={onCreate}
          disabled={creatingOrg}
        >
          {creatingOrg ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size={4} className="border-white" />
              <span>Creating<Dots /></span>
            </div>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
};
