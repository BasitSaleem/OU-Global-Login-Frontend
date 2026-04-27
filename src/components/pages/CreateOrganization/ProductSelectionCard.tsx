"use client";
import React from "react";
import { Check } from "lucide-react";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { IconName } from "@/components/ui/SvgIcon";

interface ProductSelectionCardProps {
  id: string;
  name: string;
  fullname: string;
  description: string;
  icon: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export const ProductSelectionCard: React.FC<ProductSelectionCardProps> = ({
  fullname,
  description,
  icon,
  isSelected,
  isDisabled,
  onClick,
}) => {
  return (
    <div
      onClick={() => !isDisabled && onClick()}
      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${isDisabled
        ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-100"
        : isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border hover:border-primary/50 bg-background"
        }`}
    >
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <SvgIcon name={icon as IconName} className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-text">{fullname}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3">
          <SvgIcon name="check2" width={16} height={16} className="text-primary" />
        </div>
      )}
    </div>
  );
};
