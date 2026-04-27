"use client";
import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: { id: number; label: string }[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center w-full max-w-2xl mx-auto mb-10 px-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep > step.id
                ? "bg-primary text-white"
                : currentStep === step.id
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-gray-100 text-gray-400"
                }`}
            >
              {currentStep > step.id ? <Check size={20} /> : step.id}
            </div>
            <span
              className={`text-base font-semibold ${currentStep >= step.id ? "text-primary" : "text-gray-400"
                }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4 h-px bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: currentStep > step.id ? "100%" : "0%" }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
