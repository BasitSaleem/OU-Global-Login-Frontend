'use client';
import {
  useCheckSubDomainAvailability,
  useCreateOrganization,
} from "@/apiHooks.ts/organization/organization.api";
import { CreateOrganizationData, CreateOrganizationResponse } from "@/apiHooks.ts/organization/organization.types";
import { PRODUCTS, ROUTES } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { toast } from "@/hooks/useToast";
import ProgressModal from "@/components/ui/ProgressModal";
import { Button, Input, LoadingSpinner } from "@/components/ui";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import { generateSubdomainSuggestions } from "@/utils/subdomainGenerator";
import { SubdomainSuggestion } from "@/components/SubdomainSuggestion";
import { AvailabilityStatus } from "@/components/AvailabilityStatus";
import { CreateOrganizationGuard } from "@/components/HOCs/createOrgRoute.guard";

export default function CreateOrgPage() {
  const [companyName, setCompanyName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("OI");
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [organizationData, setOrganizationData] = useState<CreateOrganizationResponse | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // const debouncedCompanyName = useDebounce(companyName.trim(), 1500);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 1500);

  // const isNameDebouncing = companyName.trim() !== debouncedCompanyName && companyName.trim().length > 0;
  const isSubDomainDebouncing = subDomain.trim() !== debouncedSubDomain && subDomain.trim().length > 0;

  const createOrgMutation = useCreateOrganization();
  const router = useRouter();

  // const { data: isNameAvailable, isFetching: checkingName, isError: nameError } =
  //   useCheckOrganizationNameAvailability(debouncedCompanyName);

  const { data: isSubAvailable, isFetching: checkingSub, isError: subError } =
    useCheckSubDomainAvailability(
      selectedProduct === "OI" ? debouncedSubDomain : ""
    );

  const subdomainSuggestions = useMemo(() => {
    if (!companyName.trim() || companyName.trim().length < 2) return [];
    return generateSubdomainSuggestions(companyName);
  }, [companyName]);

  useEffect(() => {
    if (subDomain === '' && subdomainSuggestions.length > 0 && selectedProduct === "OI") {
      setSubDomain(subdomainSuggestions[0]);
    }
  }, [subdomainSuggestions, subDomain, selectedProduct]);
  useEffect(() => {
    if (companyName.trim().length > 1) {
      setIsGeneratingSuggestions(true);
      const timer = setTimeout(() => {
        setIsGeneratingSuggestions(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsGeneratingSuggestions(false);
    }
  }, [companyName]);

  const handleSuggestionClick = (suggestion: string) => {
    setSubDomain(suggestion);
  };

  const canSubmit = () => {
    if (!companyName.trim()) return false;
    if (selectedProduct === "OI" && !subDomain.trim()) return false;
    // if (isNameDebouncing || checkingName) return false;
    if (selectedProduct === "OI" && (isSubDomainDebouncing || checkingSub)) return false;
    // if (isNameAvailable === false) return false;
    if (selectedProduct === "OI" && isSubAvailable === false) return false;
    if (createOrgMutation.isPending) return false;
    return true;
  };

  const handleSubmit = () => {
    const trimmedName = companyName.trim();
    const trimmedSubDomain = subDomain.trim();
    const payload: CreateOrganizationData = {
      name: trimmedName,
      subDomainName: trimmedSubDomain,
      product: [selectedProduct],
    };

    createOrgMutation.mutate(payload, {
      onSuccess: (data) => {
        setOrganizationData({
          data: {
            organization: data.organization,
            product: data.product,
            leadRegistration: data.leadRegistration || null,
          },
        });
        setShowProgressModal(true);
      },
      onError: (error: any) => {
        const message = (error as Error)?.message || 'Organization creation failed';
        toast.error('Failed to create organization', message);
        console.error('Organization creation failed:', error);
      }
    });
  };

  const handleModalClose = () => {
    setShowProgressModal(false);
    setOrganizationData(null);
    router.push(ROUTES.DASHBOARD)
  };

  const handleProgressComplete = () => {
    console.log("handleProgressComplete")
  };

  const handleGoHome = () => {
    setShowProgressModal(false);
    setOrganizationData(null);
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <AuthGuard>
      <CreateOrganizationGuard>
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8">
          <div className="bg-bg-secondary rounded-xl shadow-lg p-6 sm:p-12 w-full max-w-2xl border">

            <h1 className="mb-8 text-2xl sm:text-3xl font-bold text-center ">
              Create an Organization
            </h1>

            <div className="mb-6">
              <Input
                isRequired
                label="Company Name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
              {/* <AvailabilityStatus
                isLoading={checkingName}
                isAvailable={isNameAvailable}
                isDebouncing={isNameDebouncing}
                fieldName="Organization name"
                value={companyName}
              /> */}
            </div>

            {/* Products */}
            <div className="mb-6">
              <label className="block text-base font-medium mb-3">Products</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCTS.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    disabled={product.isDisabled}
                    onClick={() => setSelectedProduct(product.name)}
                    className={`flex items-center gap-2 border rounded-lg px-3 py-3 text-base font-medium transition ${selectedProduct === product.name
                      ? "border-primary bg-bg-secondary hover:text-text hover:bg-primary/70 text-primary"
                      : "border text-text"
                      } ${product.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <img
                      src={product.icon}
                      alt={product.name}
                      className="w-6 h-6"
                    />
                    {product.fullname}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Domain */}
            <div className="mb-2">
              <Input
                isRequired
                type="text"
                label="Sub-Domain Name"
                value={subDomain}
                onChange={(e) =>
                  setSubDomain(
                    e.target.value
                      .toLocaleLowerCase()
                      .trim()
                      .replace(/[^a-z0-9-]/g, "")
                  )
                }
                disabled={selectedProduct !== "OI"}
                placeholder="Enter sub-domain"
              />

              {/* Subdomain Suggestions */}
              {selectedProduct === "OI" && companyName.trim().length > 1 && (
                <SubdomainSuggestion
                  suggestions={subdomainSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                  isLoading={isGeneratingSuggestions}
                />
              )}

              {selectedProduct === "OI" && (
                <AvailabilityStatus
                  isLoading={checkingSub}
                  isAvailable={isSubAvailable}
                  isDebouncing={isSubDomainDebouncing}
                  fieldName="Sub-domain"
                  value={subDomain}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
              <Button
                variant="secondary"
                className="py-5"
                onClick={() => {
                  setCompanyName("");
                  setSubDomain("");
                  setSelectedProduct("OI");
                }}
                disabled={createOrgMutation.isPending}
              >
                Reset
              </Button>
              <Button
                onClick={handleSubmit}
                variant="primary"
                className="py-5"
                disabled={!canSubmit()}
              >
                {createOrgMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size={4} />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        </div>
      </CreateOrganizationGuard>
      <ProgressModal
        isOpen={showProgressModal}
        organizationData={organizationData}
        onClose={handleModalClose}
        onComplete={handleProgressComplete}
        onGoHome={handleGoHome}
        isFromMain={true}
      />
    </AuthGuard>
  );
}