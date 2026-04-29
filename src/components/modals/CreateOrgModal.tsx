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

export default function CreateOrgModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: CreateOrgModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [subDomain, setSubDomain] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("OI");
  const [isSuggestionSubdomain, setIsSuggestionSubdomain] = useState(false);

  const debouncedCompanyName = useDebounce(companyName.trim(), 800);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 800);

  const isSubDomainDebouncing =
    !isSuggestionSubdomain &&
    subDomain.trim() !== debouncedSubDomain &&
    subDomain.trim().length > 0;

  const shouldCheckAvailability =
    selectedProduct === "OI" && debouncedSubDomain && !isSuggestionSubdomain;

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

  const handleReset = () => {
    setCompanyName("");
    setSubDomain("");
    setSelectedProduct("OI");
    setSelectedPlanId(null);
    setCurrentStep(1);
  };

  const handleCreate = () => {
    const payload: CreateOrganizationData = {
      name: companyName.trim(),
      subDomainName: subDomain.trim(),
      product: [selectedProduct],
      packageId: selectedPlanId,
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
    if (selectedProduct === "OI" && !subDomain.trim()) return false;
    if (selectedProduct === "OI" && (isSubDomainDebouncing || checkingSub))
      return false;
    if (selectedProduct === "OI" && finalIsSubAvailable === false) return false;
    if (!selectedPlanId) return false;
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
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onNext={() => setCurrentStep(2)}
            onReset={onClose}
          />
        ) : (
          <SetupStep
            companyName={companyName}
            setCompanyName={setCompanyName}
            selectedProduct={selectedProduct}
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
