"use client";
import { useOrPlanSelection } from "@/hooks/useOrPlanSelection";
import { useDropUnavailableProducts } from "@/hooks/useDropUnavailableProducts";
import type { OrPlanIntent } from "@/apiHooks.ts/orCatalog/orCatalog.types";
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
import {
  useIncomingPackageSelection,
  clearIncomingPackageSelection,
} from "@/hooks/useIncomingPackageSelection";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/useToast";
import ProgressModal from "@/components/ui/ProgressModal";
import { useOrTrialActivation, useOrProvisionRetry } from "@/apiHooks.ts/orTrial/orTrial.api";
import { Loader, Button } from "@/components/ui";
import logger from "@/utils/logger";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useLogout } from "@/apiHooks.ts/auth/auth.api";
import { clearAuth, setOrganization } from "@/redux/slices/auth.slice";
import { useAppDispatch } from "@/redux/store";
import { StepIndicator } from "@/components/pages/CreateOrganization/StepIndicator";
import { OrganizationStep } from "@/components/pages/CreateOrganization/OrganizationStep";
import { SetupStep } from "@/components/pages/CreateOrganization/SetupStep";
import { AuthGuard } from "@/components/HOCs/auth-guard";

export default function CreateOrgPage() {
  const {
    pkgId,
    product,
    productRequested,
    billingCycle,
    opPkgId,
    opBillingCycle,
    queryPkgId,
    queryOpPkgId,
    hasDirectLink,
    orIntent,
    isReady,
  } = useIncomingPackageSelection();

  if (!isReady) return <Loader text="Loading your selection" />;

  const redirectTo = hasDirectLink ? ROUTES.REGISTER : ROUTES.LOGIN;

  return (
    <CreateOrgContent
      key={product + (orIntent?.itemId ?? pkgId ?? opPkgId ?? "")}
      initialOrIntent={orIntent}
      initialPkgId={pkgId}
      initialProduct={product}
      productRequested={productRequested}
      queryPkgId={queryPkgId}
      initialBillingCycle={billingCycle}
      initialOpPkgId={opPkgId}
      queryOpPkgId={queryOpPkgId}
      initialOpBillingCycle={opBillingCycle}
      redirectTo={redirectTo}
      existingOrgRedirectTo={hasDirectLink ? "/organizations" : undefined}
    />
  );
}

function CreateOrgContent({
  initialOrIntent,
  initialPkgId,
  initialProduct,
  productRequested,
  queryPkgId,
  initialBillingCycle,
  initialOpPkgId,
  queryOpPkgId,
  initialOpBillingCycle,
  redirectTo,
  existingOrgRedirectTo,
}: {
  initialPkgId: string | null;
  initialOrIntent: OrPlanIntent | null;
  initialProduct: string;
  productRequested: boolean;
  queryPkgId: string | null;
  initialBillingCycle: "monthly" | "yearly";
  initialOpPkgId: string | null;
  queryOpPkgId: string | null;
  initialOpBillingCycle: "monthly" | "yearly";
  redirectTo: string;
  existingOrgRedirectTo?: string;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const [companyName, setCompanyName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    initialProduct ? [initialProduct] : [],
  );
  useDropUnavailableProducts(
    productRequested,
    selectedProducts,
    setSelectedProducts,
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    initialPkgId,
  );
  // OP standalone plan id — kept separate from the OI selectedPlanId so both
  // products can be configured at once without colliding.
  const [opPackageId, setOpPackageId] = useState<string | null>(initialOpPkgId);
  const hasDirectLink = !!queryPkgId || !!queryOpPkgId || !!initialOrIntent;
  const [opMode, setOpMode] = useState<"plan" | "services">("plan");
  const [opServiceIds, setOpServiceIds] = useState<string[]>([]);
  const [opDominationUpgrade, setOpDominationUpgrade] = useState(false);
  const [opInvoiceId, setOpInvoiceId] = useState("");
  const [opInvoiceVerified, setOpInvoiceVerified] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [organizationData, setOrganizationData] =
    useState<CreateOrganizationResponse | null>(null);
  const [isSuggestionSubdomain, setIsSuggestionSubdomain] = useState(false);

  const debouncedCompanyName = useDebounce(companyName.trim(), 1500);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 1500);

  const isNameDebouncing =
    companyName.trim() !== debouncedCompanyName &&
    companyName.trim().length > 0;

  const isSubDomainDebouncing =
    !isSuggestionSubdomain &&
    subDomain.trim() !== debouncedSubDomain &&
    subDomain.trim().length > 0;

  const { data: suggestions, isFetching: fetchingSubdomainSuggestions } =
    useGenerateSubdomainSuggestions(
      !isNameDebouncing ? debouncedCompanyName : "",
    );

  const queryClient = useQueryClient();
  const { mutate: createOrgMutation, isPending: creatingOrg } =
    useCreateOrganization();
  const { mutateAsync: activateOrTrial } = useOrTrialActivation();
  const { mutateAsync: retryOrProvision } = useOrProvisionRetry();
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

  const toggleProduct = (name: string) => {
    setSelectedProducts((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  };

  const shouldCheckAvailability =
    selectedProducts.includes("OI") &&
    debouncedSubDomain &&
    !isSuggestionSubdomain;

  const { data: isSubAvailable, isFetching: checkingSub } =
    useCheckSubDomainAvailability(
      shouldCheckAvailability ? debouncedSubDomain : "",
    );

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

  const orPlanState = useOrPlanSelection(
    selectedProducts.includes("OR"),
    initialOrIntent,
  );
  const isOiSelected = selectedProducts.includes("OI");
  const isOpSelected = selectedProducts.includes("OP");
  const isOpServices = isOpSelected && opMode === "services";

  const canSubmit = () => {
    if (!companyName.trim()) return false;
    if (selectedProducts.length === 0) return false;
    if (selectedProducts.includes("OR") && !orPlanState.canSubmit) return false;
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
    if (creatingOrg) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;
    const trimmedName = companyName.trim();
    const trimmedSubDomain = subDomain.trim();

    // One combined payload for every selected product. Only include a product's
    // fields when that product is selected. OP no longer collects any in-app
    // payment (GHL bills it), so a services order flows through create → progress
    // just like the OP plan and OI paths.
    const payload: CreateOrganizationData = {
      name: trimmedName,
      orSelection: selectedProducts.includes("OR")
        ? (orPlanState.selection ?? undefined)
        : undefined,
      product: selectedProducts,
      subDomainName: isOiSelected ? trimmedSubDomain : undefined,
      packageId: isOiSelected ? selectedPlanId : null,
      opPackageId: isOpSelected && opMode === "plan" ? opPackageId : undefined,
      serviceIds: isOpServices ? opServiceIds : undefined,
      dominationUpgrade: isOpServices ? opDominationUpgrade : undefined,
      invoiceId: isOpServices ? opInvoiceId.trim() : undefined,
      billingCycle: "Monthly",
    };

    createOrgMutation(payload, {
      onSuccess: async (data: any) => {
        clearIncomingPackageSelection();
        const hasOrOnboarding = data.products && !data.leadRegistration;
        const needsProgressModal = !!data.leadRegistration || data.product;
        if (hasOrOnboarding && !needsProgressModal) {
          const orProduct = data.products?.OR;
          if (orProduct?.productId && data.organization?.id) {
            try {
              await activateOrTrial({ orgId: data.organization.id, productId: orProduct.productId });
            } catch { /* toast handled by mutation hook */ }
            try {
              await retryOrProvision({ orgId: data.organization.id, productId: orProduct.productId });
            } catch { /* provisioning retry is best-effort */ }
          }
          queryClient.invalidateQueries({ queryKey: ["organizations"] });
          // The dashboard's organization guard reads this. Without it a first
          // organization created with Owners Reach only bounces back here
          // (the progress modal sets it for the other products).
          if (data.organization) dispatch(setOrganization(data.organization));
          queryClient.invalidateQueries({ queryKey: ["me"] });
          toast.success("Created", "The organization has been successfully created.");
          router.push(ROUTES.DASHBOARD);
          return;
        }
        const orProduct = data.products?.OR;
        if (orProduct?.productId && data.organization?.id) {
          try {
            await activateOrTrial({ orgId: data.organization.id, productId: orProduct.productId });
          } catch { }
          try {
            await retryOrProvision({ orgId: data.organization.id, productId: orProduct.productId });
          } catch { }
        }
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
    setSelectedProducts(initialProduct ? [initialProduct] : []);
    orPlanState.reset();
    setSelectedPlanId(initialPkgId);
    setOpPackageId(null);
    setOpMode("plan");
    setOpServiceIds([]);
    setOpDominationUpgrade(false);
    setOpInvoiceId("");
    setOpInvoiceVerified(false);
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
    <AuthGuard
      redirectTo={redirectTo}
      existingOrgRedirectTo={existingOrgRedirectTo}
    >
      <>
        <Button
          onClick={handleLogout}
          disabled={loggingOut}
          className="fixed  right-4 top-4 p-5 bg-red-500 rounded-full border border-border text-white"
          leftIcon={<LogOut size={16} />}
        >
          Log out
        </Button>
        {(creatingOrg || loggingOut) && (
          <Loader
            text={
              loggingOut ? "Logging out" : "Initializing organization creation"
            }
          />
        )}
        <div className="min-h-48 w-full bg-background flex flex-col items-center py-12 px-4 ">
          <div className="w-full max-w-4xl bg-bg-secondary rounded-2xl border border-border  relative">
            {!hasDirectLink && (
              <StepIndicator
                steps={steps}
                currentStep={currentStep > 2 ? 2 : currentStep}
              />
            )}
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
                {currentStep === 1 && !hasDirectLink && (
                  <OrganizationStep
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    selectedProducts={selectedProducts}
                    toggleProduct={toggleProduct}
                    onNext={nextStep}
                    onReset={handleReset}
                  />
                )}

                {(currentStep === 2 ||
                  (hasDirectLink && currentStep === 1)) && (
                  <SetupStep
                    orPlanState={orPlanState}
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
                    initialBillingCycle={
                      initialProduct === "OP"
                        ? initialOpBillingCycle
                        : initialBillingCycle
                    }
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
                    isDirectFlow={hasDirectLink}
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
            // The organization already exists, even when the modal is closed
            // before setup finishes, so the dashboard must not send the user back.
            const created = organizationData?.data?.organization;
            if (created) dispatch(setOrganization(created));
            queryClient.invalidateQueries({ queryKey: ["me"] });
            setShowProgressModal(false);
            setOrganizationData(null);
            router.push(ROUTES.DASHBOARD);
          }}
          onComplete={() => logger.log("handleProgressComplete")}
          isFromMain={true}
        />
      </>
    </AuthGuard>
  );
}
