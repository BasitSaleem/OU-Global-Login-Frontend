"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Trash2, RefreshCw } from "lucide-react";

import { SvgIcon, IconName } from "@/components/ui/SvgIcon";
import { OWNER_META } from "@/components/pages/OrganizationDetails/Billing/OwnersProductItem";
import { Modal } from "@/components/modals/GenericModal";
import { Button } from "@/components/ui";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import NotFound from "@/components/NotFound";
import { useAppSelector } from "@/redux/store";
import {
  useOrganizationDetails,
  useDeleteProduct,
} from "@/apiHooks.ts/organization/organization.api";
import { useRetryProvisioning } from "@/apiHooks.ts/ghl/ghl.api";

const PRODUCT_DESC: Record<string, string> = {
  OI: "Track and manage stock",
  OP: "Marketing & CRM automation",
  OJ: "Themes and templates",
  OM: "Sell across channels",
  OA: "Deep business insights",
};

function ProductsPage() {
  const { orgId } = useParams();
  const {
    data: organization,
    isLoading,
    error,
  } = useOrganizationDetails(orgId as string);
  const user = useAppSelector((s) => s.auth.user);
  const { mutate: deleteProduct, isPending } = useDeleteProduct(orgId as string);
  const { mutate: retryProvisioning, isPending: isRetrying } =
    useRetryProvisioning(orgId as string);
  const [toDelete, setToDelete] = useState<any | null>(null);

  if (error) {
    return <NotFound title={error?.message} />;
  }

  const userRole = organization?.memberships?.find(
    (m) => m.user_id === user?.id,
  )?.role;
  if (userRole !== "OWNER" && userRole !== "ADMIN") {
    return null;
  }

  if (!organization && !isLoading) {
    return <NotFound title={"Organization Not Found"} />;
  }

  const products = organization?.products ?? [];

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteProduct(toDelete.id, { onSuccess: () => setToDelete(null) });
  };

  const labelFor = (p: any) =>
    (p.product_name && OWNER_META[p.product_name]?.toolTipText) ||
    p.product_name ||
    "Product";

  return (
    <AuthGuard>
      <div className="px-2 pt-2 pb-12 max-w-7xl w-full mx-auto md:px-11">
        <h1 className="font-bold text-2xl mb-1">Products</h1>
        <p className="text-text-secondary mb-6">
          Products set up in{" "}
          <span className="font-semibold">{organization?.name}</span>.
        </p>

        {isLoading ? (
          <p className="text-text-secondary py-8">Loading products…</p>
        ) : products.length === 0 ? (
          <div className="text-text-secondary py-10 text-center border border-border rounded-2xl">
            No products in this organization.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => {
              const meta = product.product_name
                ? OWNER_META[product.product_name]
                : undefined;
              const status = String(
                product.provisioning_status || "",
              ).toUpperCase();
              const isOp = product.product_name === "OP";
              const isFailed = isOp && status === "FAILED";
              const isPendingSetup = isOp && status === "PENDING";
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-bg-secondary"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-background">
                    <SvgIcon
                      name={(meta?.iconUrl as IconName) || "AllProducts"}
                      width={28}
                      height={28}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text truncate">
                      {labelFor(product)}
                    </h3>
                    <p className="text-sm text-text-secondary truncate">
                      {product.oi_sub_domain ||
                        PRODUCT_DESC[product.product_name || ""] ||
                        ""}
                    </p>
                  </div>

                  {isFailed && (
                    <span className="shrink-0 text-xs font-medium text-red-600 bg-red-50 rounded-full px-2.5 py-1">
                      Setup failed
                    </span>
                  )}
                  {isPendingSetup && (
                    <span className="shrink-0 text-xs font-medium text-amber-600 bg-amber-50 rounded-full px-2.5 py-1">
                      Setting up…
                    </span>
                  )}

                  {isFailed && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => retryProvisioning()}
                      disabled={isRetrying}
                      className="shrink-0"
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-1.5 ${
                          isRetrying ? "animate-spin" : ""
                        }`}
                      />
                      {isRetrying ? "Retrying…" : "Retry setup"}
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => setToDelete(product)}
                    className="shrink-0 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove product"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toDelete && (
        <Modal
          isOpen
          onClose={() => setToDelete(null)}
          size="md"
          ariaLabel="Remove product"
        >
          <Modal.Body>
            <h2 className="font-bold text-lg text-text mb-2">Remove product?</h2>
            <p className="text-text-secondary mb-6">
              This removes{" "}
              <span className="font-semibold">{labelFor(toDelete)}</span> from{" "}
              <span className="font-semibold">{organization?.name}</span> and
              tears down its account. This can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setToDelete(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isPending}
              >
                {isPending ? "Removing…" : "Remove"}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </AuthGuard>
  );
}

export default ProductsPage;
