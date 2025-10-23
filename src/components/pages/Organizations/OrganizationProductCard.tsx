import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { getColorFromId } from "@/utils/getRandomColors";
import Link from "next/link";

interface CardProps {
    code: "OI" | "OJ" | "OM" | "OA";
    organizations: OgOrganization[] | undefined;
}

export const generateProductLink = (subdomain: string) => {
    console.log('SubDomain: ', subdomain);
    
    let url = '';
    if(process.env.NODE_ENV === 'development') {
        url = `http://${subdomain}.localhost:8000/login?sso_login=true`
    } else {
        url = `http://${subdomain}.${process.env.OI_PRODUCT_DOMAIN}/login?sso_login=true`
    }

    return url;

}

const OrganizationProductCard = ({ code, organizations }: CardProps) => {
    const PRODUCT_NAME_MAP: Record<string, string> = {
        OI: "Owners Inventory",
        OJ: "Owners Jungle",
        OM: "Owners Marketplace",
        OA: "Owners Analytics",
    };

    const getProductDisplayName = (code: string): string => {
        return PRODUCT_NAME_MAP[code] || code;
    };

    const filteredOrganizations = filterOrganizationsByProduct(organizations, code);
    if (filteredOrganizations.length === 0) return null;
    console.log(code, filteredOrganizations, "/////");

    return (
        <div className="bg-bg-secondary border border-border rounded-xl p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
                >
                    <img
                        src={`/Icons/${code}_LOGO.svg`}
                        alt={getProductDisplayName(code)}
                        className="w-6 h-6"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-heading-2 mb-2">{getProductDisplayName(code)}</h3>
                    <p className="text-body-small text-gray-600 mb-2">
                        Manage your inventory
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {filteredOrganizations.map((org) => {
                            const bgColor = getColorFromId(org.id ?? "");
                            return (
                                <Link
                                    key={org.id}
                                    href={generateProductLink(org.products?.[0]?.oi_sub_domain!)}
                                    target="_blank"
                                    className="group"
                                >
                                    <div
                                        className="w-7 h-7 rounded-md flex items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                                        style={{ backgroundColor: bgColor }}
                                        title={org.name}
                                    >
                                        {org.name
                                            ? org.name.charAt(0).toUpperCase() +
                                            (org.name.charAt(1)?.toUpperCase() || "")
                                            : ""}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationProductCard;

export function filterOrganizationsByProduct(
    organizations: OgOrganization[] | undefined,
    productName: string
): OgOrganization[] {
    if (!Array.isArray(organizations)) return [];
    return organizations.filter((org) =>
        org.products?.some((product) => product.product_name === productName)
    );
}
