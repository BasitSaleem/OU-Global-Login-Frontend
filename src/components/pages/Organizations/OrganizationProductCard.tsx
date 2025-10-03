import { useGetOrganizationProducts } from "@/apiHooks.ts/organization/organization.api";
import { OgProduct } from "@/apiHooks.ts/organization/organization.types";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
const OrganizationProductCard = () => {
    const { organization } = useAppSelector((s) => s.auth)
    const { data: ogProducts } = useGetOrganizationProducts(organization?.id!)
    console.log(ogProducts, "?///////////////PRODUCTS ASS");
    console.log(organization, "?///////////////ORGANIZATION");

    return <div>
        <h2 className="text-heading-2 mb-3">Your Products</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ogProducts?.products?.map((product: OgProduct) => (
                
            <div key={product.id} className="bg-white border border-gray-200 rounded p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 ">
                    <div
                        className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
                    >
                        <img
                            src={`/Icons/${product.product_name}_LOGO.svg`}
                            alt="Owners Inventory"
                            className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-heading-2 mb-2">Owners Inventory</h3>
                        <p className="text-body-small text-gray-600 mb-2">
                            Manage your inventory
                        </p>

                        <div className="flex items-center gap-1">
                            <div
                                className="w-5 h-5 rounded flex items-center justify-center"
                                style={{ backgroundColor: "#B11E67" }}
                            >
                                <Link
                                    href={`http://${product.oi_sub_domain}.ownersanalytics.com`}
                                    target="_blank"
                                >
                                <span className="text-white text-body-tiny font-medium">
                                    {product.product_name}
                                </span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
    </div>;
}

export default OrganizationProductCard