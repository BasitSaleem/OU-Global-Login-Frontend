"use client";

import { useEffect, useState } from "react";
import { Modal } from "./GenericModal";
import {
  useCheckSubDomainAvailability,
  useGenerateSubdomainSuggestions,
} from "@/apiHooks.ts/organization/organization.api";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateOrganizationData } from "@/apiHooks.ts/organization/organization.types";
import { OrganizationStep } from "../pages/CreateOrganization/OrganizationStep";
import { SetupStep } from "../pages/CreateOrganization/SetupStep";
import { StepIndicator } from "../pages/CreateOrganization/StepIndicator";

interface CreateOrgModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationData) => void;
}

const DEFAULT_OI_PLAN_ID = "d755fe7d-4372-426c-af33-e63b71a6521f";

export default function CreateOrgModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: CreateOrgModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    DEFAULT_OI_PLAN_ID,
  );
  // OP standalone plan id — kept separate from the OI selectedPlanId so both
  // products can be configured at once without colliding.
  const [opPackageId, setOpPackageId] = useState<string | null>(null);
  const [subDomain, setSubDomain] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["OI"]);
  const [isSuggestionSubdomain, setIsSuggestionSubdomain] = useState(false);
  const [opMode, setOpMode] = useState<"plan" | "services">("plan");
  const [opServiceIds, setOpServiceIds] = useState<string[]>([]);
  const [opDominationUpgrade, setOpDominationUpgrade] = useState(false);

  const debouncedCompanyName = useDebounce(companyName.trim(), 800);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 800);

  const isSubDomainDebouncing =
    !isSuggestionSubdomain &&
    subDomain.trim() !== debouncedSubDomain &&
    subDomain.trim().length > 0;

  const isOiSelected = selectedProducts.includes("OI");
  const isOpSelected = selectedProducts.includes("OP");
  const isOpServices = isOpSelected && opMode === "services";

  const shouldCheckAvailability =
    isOiSelected && debouncedSubDomain && !isSuggestionSubdomain;

  const {
    data: isSubAvailable,
    isFetching: checkingSub,
  } = useCheckSubDomainAvailability(
    shouldCheckAvailability ? debouncedSubDomain : "",
  );

  const finalIsSubAvailable = isSuggestionSubdomain ? true : isSubAvailable;

  const { data: suggestions, isPending: fetchingSubdomainSuggestions } =
    useGenerateSubdomainSuggestions(
      companyName.trim().length > 1 ? debouncedCompanyName : "",
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

  const toggleProduct = (name: string) => {
    setSelectedProducts((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  };

  const handleReset = () => {
    setCompanyName("");
    setSubDomain("");
    setSelectedProducts(["OI"]);
    setSelectedPlanId(DEFAULT_OI_PLAN_ID);
    setOpPackageId(null);
    setOpMode("plan");
    setOpServiceIds([]);
    setOpDominationUpgrade(false);
    setCurrentStep(1);
  };

  const handleCreate = () => {
    // One combined payload for every selected product. Only include a product's
    // fields when that product is selected. OP no longer collects any in-app
    // payment (GHL bills it), so a services order flows through create like any
    // other product.
    const payload: CreateOrganizationData = {
      name: companyName.trim(),
      product: selectedProducts,
      subDomainName: isOiSelected ? subDomain.trim() : undefined,
      packageId: isOiSelected ? selectedPlanId : null,
      opPackageId: isOpSelected && opMode === "plan" ? opPackageId : undefined,
      serviceIds: isOpServices ? opServiceIds : undefined,
      dominationUpgrade: isOpServices ? opDominationUpgrade : undefined,
      billingCycle: "Monthly",
    };
    onSubmit(payload);
  };

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const canSubmit = () => {
    if (!companyName.trim()) return false;
    if (selectedProducts.length === 0) return false;
    if (isOiSelected) {
      if (!subDomain.trim()) return false;
      if (isSubDomainDebouncing || checkingSub) return false;
      if (finalIsSubAvailable === false) return false;
      if (!selectedPlanId) return false;
    }
    if (isOpSelected) {
      if (opMode === "services") {
        if (opServiceIds.length === 0) return false;
      } else if (!opPackageId) {
        return false;
      }
    }
    return true;
  };

  const steps = [
    { id: 1, label: "Organization" },
    { id: 2, label: "Setup" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxxl"
      ariaLabel="Create organization"
      className="overflow-hidden"
    >
      <div className="-mt-6">
        <StepIndicator steps={steps} currentStep={currentStep > 2 ? 2 : currentStep} />
      </div>
      <Modal.Body className="p-2">
        {currentStep === 1 ? (
          <OrganizationStep
            companyName={companyName}
            setCompanyName={setCompanyName}
            selectedProducts={selectedProducts}
            toggleProduct={toggleProduct}
            onNext={() => setCurrentStep(2)}
            onReset={handleReset}
          />
        ) : (
          <SetupStep
            companyName={companyName}
            setCompanyName={setCompanyName}
            selectedProducts={selectedProducts}
            subDomain={subDomain}
            setSubDomain={setSubDomain}
            suggestions={suggestions}
            fetchingSubdomainSuggestions={fetchingSubdomainSuggestions}
            handleSuggestionClick={handleSuggestionClick}
            checkingSub={checkingSub}
            finalIsSubAvailable={finalIsSubAvailable}
            isSubDomainDebouncing={isSubDomainDebouncing}
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            opPackageId={opPackageId}
            setOpPackageId={setOpPackageId}
            opMode={opMode}
            setOpMode={setOpMode}
            opServiceIds={opServiceIds}
            setOpServiceIds={setOpServiceIds}
            opDominationUpgrade={opDominationUpgrade}
            setOpDominationUpgrade={setOpDominationUpgrade}
            onBack={() => setCurrentStep(1)}
            onCreate={handleCreate}
            creatingOrg={isLoading}
            canSubmit={canSubmit()}
            isDirectFlow={false}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}
