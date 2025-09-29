"use client";

import {
  useCheckOrganizationNameAvailability,
  useCheckSubDomainAvailability,
  useCreateOrganization,
} from "@/apiHooks.ts/organization/organization.api";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateOrgPage() {
  const [companyName, setCompanyName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("OI");
  const debouncedCompanyName = useDebounce(companyName, 2000);
  const debouncedSubDomain = useDebounce(subDomain, 2000);
  const createOrgMutation = useCreateOrganization();
  const Router = useRouter();

  const { data: isNameAvailable, isFetching: checkingName } =
    useCheckOrganizationNameAvailability(debouncedCompanyName);

  const { data: isSubAvailable, isFetching: checkingSub } =
    useCheckSubDomainAvailability(
      selectedProduct === "OI" ? debouncedSubDomain : ""
    );

  const products = [
    {
      id: "inventory",
      name: "OI",
      fullname: "Owners Inventory",
      isDisabled: false,
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/3c4327f1dd595491744f2af966536dd987ec0a0a?width=66",
    },
    {
      id: "marketplace",
      name: "OM",
      fullname: "Owners Marketplace",
      isDisabled: true,
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/df8a47bf275bccdb600fe4495f3d4bead9cb844f?width=64",
    },
    {
      id: "analytics",
      name: "OA",
      fullname: "Owners Analytics",
      isDisabled: true,
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/72b1ea421112224fa1bea68adcd733be5aa8666b?width=76",
    },
    {
      id: "jungle",
      name: "OJ",
      fullname: "Owners Jungle",
      isDisabled: true,
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/78407e1c15d2b695844d30eed5f5358ca8da09f8?width=64",
    },
  ];

  const handleSubmit = () => {
    if (!companyName || (selectedProduct === "OI" && !subDomain)) return;

    if (isNameAvailable === false) {
      alert("Organization name is already taken");
      return;
    }
    if (selectedProduct === "OI" && isSubAvailable === false) {
      alert("Subdomain is already taken");
      return;
    }

    const payload = {
      name: companyName,
      subDomainName: subDomain,
      product: [selectedProduct],
    };

    createOrgMutation.mutate(payload, {
      onSuccess: () => {
        Router.push("/");
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-12 w-full max-w-2xl">
        <h1 className="mb-8 text-2xl sm:text-3xl font-bold text-center text-gray-900">
          Create an Organization
        </h1>

        {/* Company Name */}
        <div className="mb-6">
          <label className="block text-base font-medium mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#795CF5]"
            placeholder="Enter company name"
          />
          {companyName && (
            <p className="text-sm mt-1">
              {debouncedCompanyName !== companyName
                ? "Checking availability..."
                : isNameAvailable
                ? " Name available"
                : " Name already taken"}
            </p>
          )}
        </div>

        {/* Products */}
        <div className="mb-6">
          <label className="block text-base font-medium mb-3">Products</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                disabled={product.isDisabled}
                onClick={() => setSelectedProduct(product.name)}
                className={`flex items-center gap-2 border rounded-lg px-3 py-3 text-base font-medium transition ${
                  selectedProduct === product.name
                    ? "border-[#795CF5] bg-[#795CF512] text-[#795CF5]"
                    : "border-gray-200 text-gray-700 bg-gray-100 hover:bg-gray-200"
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-base font-medium">
              Sub-Domain Name
            </label>
            <div className="relative group">
              <span className="cursor-pointer text-white hover:text-[#795CF5] bg-gray-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                i
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap">
                  Sub-domain is for Owners Inventory only
                </div>
              </div>
            </div>
          </div>

          <input
            type="text"
            value={subDomain}
          onChange={(e) => setSubDomain(e.target.value)}
            disabled={selectedProduct !== "OI"}
            className={`w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#795CF5] ${
              selectedProduct !== "OI" ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            placeholder="Enter sub-domain"
          />
          {selectedProduct === "OI" && subDomain && (
            <p className="text-sm mt-1">
              {debouncedSubDomain !== subDomain
                ? "Checking availability..."
                : isSubAvailable
                ? "Sub-domain available"
                : "Sub-domain already taken"}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
          <button
            onClick={() => {
              setCompanyName("");
              setSubDomain("");
              setSelectedProduct("OI");
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-[#795CF5] text-[#795CF5] text-base font-medium hover:bg-[#795CF507] cursor-pointer"
            disabled={createOrgMutation.isPending}
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-white text-base font-medium cursor-pointer bg-[#795CF5] hover:bg-[#7C3AED] disabled:opacity-50"
            disabled={createOrgMutation.isPending}
          >
            {createOrgMutation.isPending ? "Creating..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
