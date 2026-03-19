"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "./GenericModal";
import { Button, Dots, Input, Loader } from "../ui";
import { PRODUCTS } from "@/constants";
import {
  useCheckSubDomainAvailability,
  useGenerateSubdomainSuggestions,
} from "@/apiHooks.ts/organization/organization.api";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateOrganizationData } from "@/apiHooks.ts/organization/organization.types";
import { SubdomainSuggestion } from "../SubdomainSuggestion";
import { AvailabilityStatus } from "../AvailabilityStatus";
import { SvgIcon } from "../ui/SvgIcon";
import OgPlanSelector from "../pages/Organizations/OgPlanSelector";

interface CreateOrgModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationData) => void;
}

export default function CreateOrgModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: CreateOrgModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subDomain, setSubDomain] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("OI");
  const [isSuggestionSubdomain, setIsSuggestionSubdomain] = useState(false);
  const debouncedCompanyName = useDebounce(companyName.trim(), 800);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 800);
  const isNameDebouncing =
    companyName.trim() !== debouncedCompanyName &&
    companyName.trim().length > 0;
  const isSubDomainDebouncing =
    !isSuggestionSubdomain &&
    subDomain.trim() !== debouncedSubDomain &&
    subDomain.trim().length > 0;
  const shouldCheckAvailability =
    selectedProduct === "OI" && debouncedSubDomain && !isSuggestionSubdomain;
  const {
    data: isSubAvailable,
    isFetching: checkingSub,
    isError: subError,
  } = useCheckSubDomainAvailability(
    shouldCheckAvailability ? debouncedSubDomain : "",
  );
  const finalIsSubAvailable = isSuggestionSubdomain ? true : isSubAvailable;
  const { data: suggestions, isPending: fetchingSubdomainSuggestions } =
    useGenerateSubdomainSuggestions(
      !isNameDebouncing ? debouncedCompanyName : "",
    );

  useEffect(() => {
    if (isSuggestionSubdomain && !suggestions?.includes(subDomain.trim())) {
      setIsSuggestionSubdomain(false);
    }
  }, [subDomain, suggestions, isSuggestionSubdomain]);

  useEffect(() => {
    if (suggestions && suggestions.length > 0 && !subDomain.trim()) {
      setSubDomain(suggestions[0]);
      setIsSuggestionSubdomain(true);
    }
  }, [suggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setIsSuggestionSubdomain(true);
    setSubDomain(suggestion);
  };

  const canSubmit = () => {
    if (!companyName.trim()) return false;
    if (selectedProduct === "OI" && !subDomain.trim()) return false;
    if (selectedProduct === "OI" && (isSubDomainDebouncing || checkingSub))
      return false;
    if (selectedProduct === "OI" && finalIsSubAvailable === false) return false;
    return true;
  };

  const handleSubmit = () => {
    const trimmedName = companyName.trim();
    const trimmedSubDomain = subDomain.trim();
    const payload: CreateOrganizationData = {
      name: trimmedName,
      subDomainName: trimmedSubDomain,
      product: [selectedProduct],
      packageId: selectedPlan,
    };

    onSubmit(payload);
  };

  useEffect(() => {
    if (!isOpen) {
      setCompanyName("");
      setSubDomain("");
      setSelectedProduct("OI");
      setIsSuggestionSubdomain(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel="Create organization"
    >
      {isLoading && <Loader text="Initializing organization creation" />}
      <Modal.Title className="mb-2 text-heading-2">
        Create an Organization
      </Modal.Title>
      <Modal.Body className="pb-10">
        <div className="mb-4">
          <Input
            label="Company Name"
            isRequired
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))
            }
          />
        </div>

        <label className="block text-body-small font-medium mb-2 ml-1">
          Products
        </label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product.name)}
              disabled={product.isDisabled}
              className={`flex items-center gap-2 border justify-start rounded-lg px-3 py-3 text-base font-medium transition mb-1 ${
                selectedProduct === product.name
                  ? "border-primary bg-bg-secondary text-primary"
                  : "border text-text bg-bg-secondary hover:bg-primary/10"
              } ${
                product.isDisabled
                  ? "cursor-not-allowed opacity-50  bg-primary/10"
                  : "cursor-pointer"
              }`}
            >
              <SvgIcon name={product.icon} width={16} height={16} />
              {product.fullname}
            </button>
          ))}
        </div>

        {selectedProduct === "OI" && (
          <div className="mb-4">
            <Input
              label="Sub-Domain"
              isRequired
              value={subDomain}
              disabled={fetchingSubdomainSuggestions}
              onChange={(e) =>
                setSubDomain(
                  e.target.value
                    .toLocaleLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]/g, ""),
                )
              }
            />
            <AvailabilityStatus
              isLoading={checkingSub}
              isAvailable={finalIsSubAvailable}
              isDebouncing={isSubDomainDebouncing}
              fieldName="Sub-domain"
              value={subDomain}
            />
            {companyName.trim().length > 1 && (
              <SubdomainSuggestion
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                isLoading={fetchingSubdomainSuggestions}
              />
            )}
          </div>
        )}

        <OgPlanSelector
          selectedPlane={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} variant="secondary" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || !canSubmit() || !selectedPlan}
        >
          {" "}
          {isLoading ? (
            <span>
              {" "}
              Creating <Dots dotSize="3px" className="text-white gap-1 mt-1" />
            </span>
          ) : (
            "Continue"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
