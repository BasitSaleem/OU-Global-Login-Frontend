"use client";
import React from "react";
import { Input, Button } from "@/components/ui";
import { ProductSelectionCard } from "./ProductSelectionCard";
import { PRODUCTS } from "@/constants";
import { ArrowRight, ChevronRight } from "lucide-react";

interface OrganizationStepProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  selectedProducts: string[];
  toggleProduct: (val: string) => void;
  onNext: () => void;
  onReset: () => void;
}

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  OI: "Track and manage stock",
  OP: "Marketing & CRM automation",
  OM: "Sell across channels",
  OA: "Deep business insights",
  OJ: "Themes and templates",
};

export const OrganizationStep: React.FC<OrganizationStepProps> = ({
  companyName,
  setCompanyName,
  selectedProducts,
  toggleProduct,
  onNext,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-bold text-text mb-2">Create an Organization</h2>
        <p className="text-gray-500">Set up your workspace in just 2 steps</p>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <Input
            isRequired
            label="Organization Name"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && companyName.trim() && selectedProducts.length > 0) {
                e.preventDefault();
                onNext();
              }
            }}
            placeholder="Enter organization name"
            className="w-full px-6 bg-background py-5  rounded-xl focus:border-primary focus:ring-0 transition-all font-medium pr-24"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-base font-semibold text-text">
            Select Products <span className="text-text-secondary font-normal text-sm">(choose one or more)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRODUCTS.map((product) => (
              <ProductSelectionCard
                key={product.id}
                id={product.id}
                name={product.name}
                fullname={product.fullname}
                description={PRODUCT_DESCRIPTIONS[product.name] || ""}
                icon={product.icon}
                isSelected={selectedProducts.includes(product.name)}
                isDisabled={product.isDisabled}
                onClick={() => toggleProduct(product.name)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="secondary"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          rightIcon={<ArrowRight />}
          onClick={onNext}
          disabled={!companyName.trim() || selectedProducts.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
