"use client";

import React, { useEffect, useRef, useState } from "react";
import { Asterisk, ChevronDown, Search } from "lucide-react";
import { cn } from "@/utils/helpers";

export interface DropdownOption {
  value: string;
  label: string | React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  isRequired?: boolean;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  isSearchable?: boolean;
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
  isSearchable = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) => {
    if (!isSearchable || !searchQuery) return true;
    const labelText =
      typeof option.label === "string"
        ? option.label
        : option.value;
    return labelText.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  useEffect(() => {
    if (isOpen && isSearchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen, isSearchable]);

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
                width={10}
                height={10}
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
              "h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full max-h-60 overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-lg flex flex-col">
            {isSearchable && (
              <div className="p-2 border-b border-border sticky top-0 bg-bg-secondary z-10">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-input-bg border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            <ul className="overflow-auto py-1" role="listbox">
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-text-secondary">
                  No options found
                </li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={value === option.value}
                  >
                    <button
                      type="button"
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm text-text hover:bg-primary/10 transition-colors",
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
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
