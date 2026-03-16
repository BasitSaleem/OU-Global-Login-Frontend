"use client";

import React, { useEffect, useRef, useState } from "react";
import { Asterisk, ChevronDown } from "lucide-react";
import { cn } from "@/utils/helpers";

export interface DropdownOption {
  value: string;
  label: string | React.ReactNode;
}

export interface DropdownProps {
  /** Options to show in the dropdown */
  options: DropdownOption[];
  /** Current value (controlled) */
  value?: string;
  /** Called when selection changes */
  onChange?: (value: string) => void;
  /** Label above the trigger */
  label?: string;
  /** Validation or helper error message */
  error?: string;
  /** Show required asterisk */
  isRequired?: boolean;
  /** Root wrapper className */
  className?: string;
  /** Disable the dropdown */
  disabled?: boolean;
  /** Placeholder when nothing selected */
  placeholder?: string;
  /** Optional aria label for the trigger */
  ariaLabel?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  label,
  error,
  isRequired,
  className,
  disabled = false,
  placeholder = "Select an option",
  ariaLabel,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (option: DropdownOption) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const baseStyles =
    "flex h-10 w-full mt-1  text-text rounded-lg border bg-input-bg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
  const disabledStyles = disabled
    ? "bg-primary/20 text-gray-500 border-gray-300"
    : "";

  return (
    <div className={cn("space-y-1", className)} ref={containerRef}>
      {label && (
        <label className="text-sm text-text ml-1 block">
          {isRequired ? (
            <>
              {label}
              <Asterisk
                className="inline mb-2 ml-0.5"
                width={14}
                height={14}
                color="red"
              />
            </>
          ) : (
            label
          )}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel ?? label ?? "Open dropdown"}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={() => !disabled && setIsOpen((o) => !o)}
          className={cn(
            baseStyles,
            errorStyles,
            disabledStyles,
            "flex items-center justify-between text-left w-full",
            !selectedOption ? "text-gray-500" : "",
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-gray-500 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <ul
            className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-border bg-bg-secondary py-1 shadow-lg"
            role="listbox"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-text-secondary">
                No options
              </li>
            ) : (
              options.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <button
                    type="button"
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm text-text hover:bg-primary/10",
                      value === option.value && "bg-primary/10 font-medium",
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
