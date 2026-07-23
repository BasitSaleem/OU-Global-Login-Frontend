import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { PermissionGuard } from "@/components/HOCs/permission-guard";
import { getColorFromId } from "@/utils/getRandomColors";
import { organizationName } from "@/utils/organizationName";
import Link from "next/link";
import OrganizationProductItem from "./OrganizationProductItem";
import OrganizationOpItem from "./OrganizationOpItem";
interface CardProps {
  code: "OI" | "OJ" | "OM" | "OA" | "OP";
  metaData:
    | {
        totalCount: number;
        hasMore: boolean;
      }
    | undefined;
  organizations: OgOrganization[] | undefined;
}

export const generateProductLink = (subdomain: string) => {
  let url = "";
  if (process.env.NODE_ENV === "development") {
    url = `http://${subdomain}.localhost:8001/login`;
  } else {
    url = `https://${subdomain}.${process.env.NEXT_PUBLIC_OI_PRODUCT_DOMAIN}/login`;
  }

  return url;
};

const OrganizationProductCard = ({
  code,
  organizations,
  metaData,
}: CardProps) => {
  const PRODUCT_NAME_MAP: Record<string, string> = {
    OI: "Owners Inventory",
    OJ: "Owners Jungle",
    OM: "Owners Marketplace",
    OA: "Owners Analytics",
    OP: "Owners Pulse",
  };

  const PRODUCT_DESC_MAP: Record<string, string> = {
    OI: "Manage your inventory",
    OJ: "Themes and templates",
    OM: "Sell across channels",
    OA: "Deep business insights",
    OP: "Marketing & CRM automation",
  };

  const getProductDisplayName = (code: string): string => {
    return PRODUCT_NAME_MAP[code] || code;
  };

  const filteredOrganizations = filterOrganizationsByProduct(
    organizations,
    code,
  );
  if (filteredOrganizations.length === 0) return null;
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0">
          <img
            src={`/Icons/${code}_LOGO.svg?v=2`}
            alt={getProductDisplayName(code)}
            className="w-6 h-6"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-heading-2 mb-2">{getProductDisplayName(code)}</h3>
          <p className="text-body-small text-gray-600 mb-2">
            {PRODUCT_DESC_MAP[code] || ""}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {filteredOrganizations.slice(0, 8).map((org) => {
              const bgColor = getColorFromId(org.id ?? "");
              return (
                <PermissionGuard
                  key={org.id}
                  requiredPermissions="og:access::products"
                  fallback={
                    <div key={org.id} className="group">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-semibold text-sm transition-transform cursor-not-allowed"
                        style={{ backgroundColor: bgColor }}
                        title={org.name}
                      >
                        {organizationName(org.name ?? "")}
                      </div>
                    </div>
                  }
                >
                  {org.products
                    ?.filter((p) => p.product_name === code)
                    .map((product) =>
                      code === "OP" ? (
                        <OrganizationOpItem
                          key={product.id}
                          product={product}
                          org={org}
                          bgColor={bgColor}
                        />
                      ) : product.oi_sub_domain ? (
                        <OrganizationProductItem
                          key={product.oi_sub_domain}
                          product={product}
                          bgColor={bgColor}
                          org={org}
                        />
                      ) : null,
                    )}
                </PermissionGuard>
              );
            })}
            {metaData?.hasMore && (
              <Link
                href="/organizations"
                className="text-primary ml-5 text-sm underline hover:text-primary/80"
              >
                View all
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProductCard;

export function filterOrganizationsByProduct(
  organizations: OgOrganization[] | undefined,
  productName: string,
): OgOrganization[] {
  if (!Array.isArray(organizations)) return [];
  return organizations.filter((org) =>
    org.products?.some((product) => product.product_name === productName),
  );
}
