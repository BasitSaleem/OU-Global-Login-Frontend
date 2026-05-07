"use client";
import {
  useCheckSubDomainAvailability,
  useCreateOrganization,
  useGenerateSubdomainSuggestions,
} from "@/apiHooks.ts/organization/organization.api";
import {
  CreateOrganizationData,
  CreateOrganizationResponse,
} from "@/apiHooks.ts/organization/organization.types";
import { ROUTES } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/useToast";
import ProgressModal from "@/components/ui/ProgressModal";
import { Loader, Button } from "@/components/ui";
import logger from "@/utils/logger";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useLogout } from "@/apiHooks.ts/auth/auth.api";
import { clearAuth } from "@/redux/slices/auth.slice";
import { useAppDispatch } from "@/redux/store";
import { StepIndicator } from "@/components/pages/CreateOrganization/StepIndicator";
import { OrganizationStep } from "@/components/pages/CreateOrganization/OrganizationStep";
import { SetupStep } from "@/components/pages/CreateOrganization/SetupStep";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import { CreateOrganizationGuard } from "@/components/HOCs/createOrgRoute.guard";

export default function CreateOrgPage() {
  const searchParams = useSearchParams();
  const queryPkgId = searchParams.get("pkgId");
  const queryProduct = searchParams.get("product");
  const queryBillingCycle = searchParams.get("billingCycle");

  const pkgId =
    queryPkgId ||
    (typeof window !== "undefined" ? localStorage.getItem("pkgId") : null) ||
    "d755fe7d-4372-426c-af33-e63b71a6521f";

  const product =
    queryProduct ||
    (typeof window !== "undefined" ? localStorage.getItem("product") : null) ||
    "OI";

  const billingCycle =
    queryBillingCycle ||
    (typeof window !== "undefined" ? localStorage.getItem("billingCycle") : null) ||
    "monthly";

  useEffect(() => {
    if (queryPkgId) {
      localStorage.setItem("pkgId", queryPkgId);
    }
    if (queryProduct) {
      localStorage.setItem("product", queryProduct);
    }
    if (queryBillingCycle) {
      localStorage.setItem("billingCycle", queryBillingCycle);
    }
  }, [queryPkgId, queryProduct, queryBillingCycle]);

  return (
    <CreateOrgContent
      initialPkgId={pkgId}
      initialProduct={product}
      queryPkgId={queryPkgId}
      initialBillingCycle={billingCycle as "monthly" | "yearly"}
    />
  );
}

function CreateOrgContent({
  initialPkgId,
  initialProduct,
  queryPkgId,
  initialBillingCycle,
}: {
  initialPkgId: string | null;
  initialProduct: string;
  queryPkgId: string | null;
  initialBillingCycle: "monthly" | "yearly";
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const [companyName, setCompanyName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialPkgId);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [organizationData, setOrganizationData] = useState<CreateOrganizationResponse | null>(null);
  const [isSuggestionSubdomain, setIsSuggestionSubdomain] = useState(false);

  const debouncedCompanyName = useDebounce(companyName.trim(), 1500);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 1500);

  const isNameDebouncing =
    companyName.trim() !== debouncedCompanyName && companyName.trim().length > 0;

  const isSubDomainDebouncing =
    !isSuggestionSubdomain &&
    subDomain.trim() !== debouncedSubDomain &&
    subDomain.trim().length > 0;

  const { data: suggestions, isFetching: fetchingSubdomainSuggestions } =
    useGenerateSubdomainSuggestions(!isNameDebouncing ? debouncedCompanyName : "");

  const { mutate: createOrgMutation, isPending: creatingOrg } = useCreateOrganization();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearAuth());
        router.push("/login");
      },
      onError: (error) => {
        logger.error("Logout failed:", error);
      },
    });
  };

  const shouldCheckAvailability =
    selectedProduct === "OI" && debouncedSubDomain && !isSuggestionSubdomain;

  const { data: isSubAvailable, isFetching: checkingSub } =
    useCheckSubDomainAvailability(shouldCheckAvailability ? debouncedSubDomain : "");

  const finalIsSubAvailable = isSuggestionSubdomain ? true : isSubAvailable;

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
    if (selectedProduct === "OI" && (isSubDomainDebouncing || checkingSub)) return false;
    if (selectedProduct === "OI" && finalIsSubAvailable === false) return false;
    if (!selectedPlanId) return false;
    if (creatingOrg) return false;
    return true;
  };

  const handleSubmit = () => {
    const trimmedName = companyName.trim();
    const trimmedSubDomain = subDomain.trim();
    const payload: CreateOrganizationData = {
      name: trimmedName,
      subDomainName: trimmedSubDomain,
      product: [selectedProduct],
      packageId: selectedPlanId,
    };

    createOrgMutation(payload, {
      onSuccess: (data) => {
        setOrganizationData({
          data: {
            organization: data.organization,
            product: data.product,
            leadRegistration: data.leadRegistration || null,
          },
        });
        setShowProgressModal(true);
        localStorage.removeItem("pkgId");
      },
      onError: (error: any) => {
        const message = (error as Error)?.message || "Organization creation failed";
        toast.error("Failed to create organization", message);
        logger.error("Organization creation failed:", error);
      },
    });
  };

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setCompanyName("");
    setSubDomain("");
    setSelectedProduct("OI");
    setSelectedPlanId(initialPkgId);
    setCurrentStep(1);
    setDirection(-1);
  };

  const steps = [
    { id: 1, label: "Organization" },
    { id: 2, label: "Setup" },
  ];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  return (
    <AuthGuard>
      <>
        <Button
          onClick={handleLogout}
          disabled={loggingOut}
          className="fixed  right-4 top-4 p-5 bg-red-500 rounded-full border border-border text-white"
          leftIcon={<LogOut size={16}


          />}
        >
          Log out
        </Button>
        {(creatingOrg || loggingOut) && <Loader text={loggingOut ? "Logging out" : "Initializing organization creation"} />}
        <div className="min-h-48 w-full bg-background flex flex-col items-center py-12 px-4 ">

          <div className="w-full max-w-4xl bg-bg-secondary rounded-2xl border border-border  relative">
            {!queryPkgId && <StepIndicator steps={steps} currentStep={currentStep > 2 ? 2 : currentStep} />}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="p-8 md:p-4"
              >
                {currentStep === 1 && !queryPkgId && (
                  <OrganizationStep
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    onNext={nextStep}
                    onReset={handleReset}
                  />
                )}

                {(currentStep === 2 || (queryPkgId && currentStep === 1)) && (
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
                    initialBillingCycle={initialBillingCycle}
                    onBack={() => {
                      if (queryPkgId) {
                        setSelectedPlanId(initialPkgId);
                      } else {
                        prevStep();
                      }
                    }}
                    onCreate={handleSubmit}
                    canSubmit={canSubmit()}
                    creatingOrg={creatingOrg}
                    isDirectFlow={!!queryPkgId}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <ProgressModal
          isOpen={showProgressModal}
          organizationData={organizationData}
          onClose={() => {
            setShowProgressModal(false);
            setOrganizationData(null);
            router.push(ROUTES.DASHBOARD);
          }}
          onComplete={() => logger.log("handleProgressComplete")}
          onGoHome={() => {
            setShowProgressModal(false);
            setOrganizationData(null);
            router.push(ROUTES.DASHBOARD);
          }}
          isFromMain={true}
        />
      </>
    </AuthGuard>
  );
}

