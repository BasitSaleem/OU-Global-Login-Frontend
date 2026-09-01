"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Modal } from "./GenericModal";
import { Button } from "@/components/ui";
import { StepIndicator } from "../pages/CreateOrganization/StepIndicator";
import { ProductSelectionCard } from "../pages/CreateOrganization/ProductSelectionCard";
import { SetupStep } from "../pages/CreateOrganization/SetupStep";
import { PRODUCTS } from "@/constants";
import {
  useAddProduct,
  useCheckSubDomainAvailability,
  useGenerateSubdomainSuggestions,
} from "@/apiHooks.ts/organization/organization.api";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateOrganizationData } from "@/apiHooks.ts/organization/organization.types";
import { toast } from "@/hooks/useToast";

interface AddProductModalProps {
  isOpen: boolean;
  orgId: string;
  orgName: string;
  // Product codes already provisioned on this org (e.g. ["OI"]).
  existingProducts: string[];
  onClose: () => void;
  onDone?: () => void;
}

const DEFAULT_OI_PLAN_ID = "d755fe7d-4372-426c-af33-e63b71a6521f";

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  OI: "Track and manage stock",
  OP: "Marketing & CRM automation",
  OM: "Sell across channels",
  OA: "Deep business insights",
  OJ: "Themes and templates",
};

export default function AddProductModal({
  isOpen,
  orgId,
  orgName,
  existingProducts,
  onClose,
  onDone,
}: AddProductModalProps) {
  const available = useMemo(
    () => ["OI", "OP"].filter((p) => !existingProducts.includes(p)),
    [existingProducts],
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    available.length === 1 ? [available[0]] : [],
  );
  const [subDomain, setSubDomain] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    DEFAULT_OI_PLAN_ID,
  );
  const [opPackageId, setOpPackageId] = useState<string | null>(null);
  const [opMode, setOpMode] = useState<"plan" | "services">("plan");
  const [opServiceIds, setOpServiceIds] = useState<string[]>([]);
  const [opDominationUpgrade, setOpDominationUpgrade] = useState(false);
  const [opInvoiceId, setOpInvoiceId] = useState("");
  const [opInvoiceVerified, setOpInvoiceVerified] = useState(false);
  const [isSuggestionSubdomain, setIsSuggestionSubdomain] = useState(false);

  const isOiSelected = selectedProducts.includes("OI");
  const isOpSelected = selectedProducts.includes("OP");
  const isOpServices = isOpSelected && opMode === "services";

  const debouncedSubDomain = useDebounce(subDomain.trim(), 800);
  const isSubDomainDebouncing =
    !isSuggestionSubdomain &&
    subDomain.trim() !== debouncedSubDomain &&
    subDomain.trim().length > 0;

  const { data: suggestions, isPending: fetchingSubdomainSuggestions } =
    useGenerateSubdomainSuggestions(isOiSelected ? orgName : "");

  const shouldCheckAvailability =
    isOiSelected && debouncedSubDomain && !isSuggestionSubdomain;
  const { data: isSubAvailable, isFetching: checkingSub } =
    useCheckSubDomainAvailability(
      shouldCheckAvailability ? debouncedSubDomain : "",
    );
  const finalIsSubAvailable = isSuggestionSubdomain ? true : isSubAvailable;

  const { mutate: addProduct, isPending } = useAddProduct(orgId);

  const toggleProduct = (name: string) => {
    setSelectedProducts((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIsSuggestionSubdomain(true);
    setSubDomain(suggestion);
  };

  const canSubmit = () => {
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
        if (!opInvoiceVerified) return false;
      } else if (!opPackageId) {
        return false;
      }
    }
    return true;
  };

  const handleAdd = () => {
    // `name` is the existing org's name — the backend uses the org's own name
    // for the shell, but the per-product schemas still require it.
    const payload: CreateOrganizationData = {
      name: orgName,
      product: selectedProducts,
      subDomainName: isOiSelected ? subDomain.trim() : undefined,
      packageId: isOiSelected ? selectedPlanId : null,
      opPackageId: isOpSelected && opMode === "plan" ? opPackageId : undefined,
      serviceIds: isOpServices ? opServiceIds : undefined,
      dominationUpgrade: isOpServices ? opDominationUpgrade : undefined,
      invoiceId: isOpServices ? opInvoiceId.trim() : undefined,
      billingCycle: "Monthly",
    };

    addProduct(payload, {
      onSuccess: () => {
        toast.success(
          "Product added",
          "Provisioning is running in the background.",
        );
        onDone?.();
        onClose();
      },
    });
  };

  const steps = [
    { id: 1, label: "Product" },
    { id: 2, label: "Setup" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxxl"
      ariaLabel="Add a product"
      className="overflow-hidden"
    >
      <div className="-mt-6">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>
      <Modal.Body className="p-2">
        {currentStep === 1 ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Add a Product</h2>
              <p className="text-text-secondary text-sm">
                Add another product to{" "}
                <span className="font-semibold">{orgName}</span>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-base font-semibold text-text">
                Select a product
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRODUCTS.map((product) => {
                  const alreadyAdded = existingProducts.includes(product.name);
                  return (
                    <ProductSelectionCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      fullname={product.fullname}
                      description={
                        alreadyAdded
                          ? "Already added to this organization"
                          : PRODUCT_DESCRIPTIONS[product.name] || ""
                      }
                      icon={product.icon}
                      isSelected={selectedProducts.includes(product.name)}
                      isDisabled={product.isDisabled || alreadyAdded}
                      onClick={() => toggleProduct(product.name)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                rightIcon={<ArrowRight />}
                onClick={() => setCurrentStep(2)}
                disabled={selectedProducts.length === 0}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <SetupStep
            companyName={orgName}
            setCompanyName={() => {}}
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
            opInvoiceId={opInvoiceId}
            setOpInvoiceId={setOpInvoiceId}
            opInvoiceVerified={opInvoiceVerified}
            setOpInvoiceVerified={setOpInvoiceVerified}
            onBack={() => setCurrentStep(1)}
            onCreate={handleAdd}
            creatingOrg={isPending}
            canSubmit={canSubmit()}
            isDirectFlow={false}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}
