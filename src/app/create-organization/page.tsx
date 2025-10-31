"use client";

import {
  useCheckOrganizationNameAvailability,
  useCheckSubDomainAvailability,
  useCreateOrganization,
} from "@/apiHooks.ts/organization/organization.api";
import { CreateOrganizationData, CreateOrganizationResponse } from "@/apiHooks.ts/organization/organization.types";
import { PRODUCTS, ROUTES } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/useToast";
import ProgressModal from "@/components/ui/ProgressModal";
import { CheckCircle, Route, XCircle } from "lucide-react";
import { Button, Input, LoadingSpinner } from "@/components/ui";
import { AuthGuard } from "@/components/guards/auth-guard";
import { GlobalLoading } from "@/components/ui/loading";
import { setAuth, setOrganization } from "@/redux/slices/auth.slice";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { CreateOrganizationGuard } from "@/components/guards/createOrgRoute.guard";


interface AvailabilityStatusProps {
  isLoading: boolean;
  isAvailable?: boolean;
  isDebouncing: boolean;
  fieldName: string;
  value: string;
}

const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({
  isLoading,
  isAvailable,
  isDebouncing,
  fieldName,
  value
}) => {
  if (!value) return null;

  if (isDebouncing) {
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-text">
        <LoadingSpinner size={4} className="border-text" />
        <span>Checking {fieldName} availability...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
        <LoadingSpinner size={4} className="border-blue-600" />
        <span>Verifying {fieldName}...</span>
      </div>
    );
  }

  if (isAvailable === true) {
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span>{fieldName} is available</span>
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
        <XCircle className="w-4 h-4" />
        <span>{fieldName} is already taken</span>
      </div>
    );
  }

  return null;
};
export default function CreateOrgPage() {
  const [companyName, setCompanyName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("OI");
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [organizationData, setOrganizationData] = useState<CreateOrganizationResponse | null>(null);
  const debouncedCompanyName = useDebounce(companyName.trim(), 1500);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 1500);
  // Check if we're still debouncing
  const isNameDebouncing = companyName.trim() !== debouncedCompanyName && companyName.trim().length > 0;
  const isSubDomainDebouncing = subDomain.trim() !== debouncedSubDomain && subDomain.trim().length > 0;
  const dispatch = useAppDispatch()
  const createOrgMutation = useCreateOrganization();
  const Router = useRouter();

  const { data: isNameAvailable, isFetching: checkingName, isError: nameError } =
    useCheckOrganizationNameAvailability(debouncedCompanyName);

  const { data: isSubAvailable, isFetching: checkingSub, isError: subError } =
    useCheckSubDomainAvailability(
      selectedProduct === "OI" ? debouncedSubDomain : ""
    );

  // Determine if we can submit
  const canSubmit = () => {
    if (!companyName.trim()) return false;
    if (selectedProduct === "OI" && !subDomain.trim()) return false;
    if (isNameDebouncing || checkingName) return false;
    if (selectedProduct === "OI" && (isSubDomainDebouncing || checkingSub)) return false;
    if (isNameAvailable === false) return false;
    if (selectedProduct === "OI" && isSubAvailable === false) return false;
    if (createOrgMutation.isPending) return false;
    return true;
  };



  const handleSubmit = () => {
    const trimmedName = companyName.trim();
    const trimmedSubDomain = subDomain.trim();

    // if (!trimmedName) {
    //   toast.error('Please enter a company name');
    //   return;
    // }

    // if (selectedProduct === "OI" && !trimmedSubDomain) {
    //   toast.error('Please enter a sub-domain');
    //   return;
    // }

    // if (isNameDebouncing || checkingName) {
    //   toast.error('Please wait while we verify the organization name');
    //   return;
    // }

    // if (selectedProduct === "OI" && (isSubDomainDebouncing || checkingSub)) {
    //   toast.error('Please wait while we verify the sub-domain');
    //   return;
    // }

    // if (isNameAvailable === false) {
    //   toast.error('Organization name is already taken. Please choose a different name.');
    //   return;
    // }

    // if (selectedProduct === "OI" && isSubAvailable === false) {
    //   toast.error('Sub-domain is already taken. Please choose a different sub-domain.');
    //   return;
    // }

    // if (nameError) {
    //   toast.error('Unable to verify organization name. Please try again.');
    //   return;
    // }

    // if (selectedProduct === "OI" && subError) {
    //   toast.error('Unable to verify sub-domain. Please try again.');
    //   return;
    // }

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
        // dispatch(setOrganization({ organization: data.organization }))
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
  };

  const handleProgressComplete = () => {
    Router.push(ROUTES.DASHBOARD)
  };

  const handleGoHome = () => {
    setShowProgressModal(false);
    setOrganizationData(null);
    Router.push(ROUTES.DASHBOARD);
  };
  return (
    <CreateOrganizationGuard>
      <AuthGuard fallback={<GlobalLoading />}>
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8">
          <div className="bg-bg-secondary rounded-xl shadow-lg p-6 sm:p-12 w-full max-w-2xl border">
            <h1 className="mb-8 text-2xl sm:text-3xl font-bold text-center ">
              Create an Organization
            </h1>

            {/* Company Name */}
            <div className="mb-6">

              <Input
                isRequired
                label="Company Name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
              <AvailabilityStatus
                isLoading={checkingName}
                isAvailable={isNameAvailable}
                isDebouncing={isNameDebouncing}
                fieldName="Organization name"
                value={companyName}
              />
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
                onChange={(e) => setSubDomain(e.target.value)}
                disabled={selectedProduct !== "OI"}
                placeholder="Enter sub-domain"
              />
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

        <ProgressModal
          isOpen={showProgressModal}
          organizationData={organizationData}
          onClose={handleModalClose}
          onComplete={handleProgressComplete}
          onGoHome={handleGoHome}
          isFromMain={true}
        />
      </AuthGuard>
    </CreateOrganizationGuard>
  );
}
