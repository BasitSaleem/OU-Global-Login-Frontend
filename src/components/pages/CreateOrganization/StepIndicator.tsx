"use client";
import React from "react";
import { SvgIcon } from "@/components/ui/SvgIcon";

interface StepIndicatorProps {
  steps: { id: number; label: string }[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex items-center w-full px-8 pt-4">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-success-bg"
                    : isActive
                      ? "bg-primary text-white"
                      : "bg-card-secondary text-text-secondary"
                }`}
              >
                {isCompleted ? (
                  <SvgIcon
                    name="check3"
                    width={15}
                    height={15}
                    className="text-success"
                  />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-sm font-bold ${
                  isCompleted
                    ? "text-success"
                    : isActive
                      ? "text-primary"
                      : "text-text-secondary"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-6 h-[2px] bg-border" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
