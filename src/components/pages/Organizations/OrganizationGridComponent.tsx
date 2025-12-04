import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { useAppSelector } from "@/redux/store";
import { User } from "@/types/auth.types";
import { getColorFromId } from "@/utils/getRandomColors";
import { Trash } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { generateProductLink } from "./OrganizationProductCard";
import { PermissionGuard } from "@/components/HOCs/permission-guard";
import { Button } from "@/components/ui";
import Image from "next/image";

interface OrganizationGridComponentProps {
  id: string;
  org: OgOrganization;
  isPending: boolean;
  handleFavoriteClick: (e: React.MouseEvent, orgId: string) => void;
  user: User | null;
  handleDeleteClick: (org: any) => void;
}

export function OrganizationGridComponent({
  id,
  org,
  isPending,
  handleFavoriteClick,
  user,
  handleDeleteClick,
}: OrganizationGridComponentProps) {
  const [isUpdate, setIsUpdate] = useState<boolean>(
    org?.favorites?.some((fUser) => fUser.userId === user?.id) ?? false
  );
  const { organization } = useAppSelector((s) => s.auth)
  const bgColor = useMemo(() => getColorFromId(org.id), [org.id]);
  return (
    <div key={id} className="flex flex-col h-[100px]">
      {/* Top section */}
      <div key={org.id} className="flex items-start gap-3 mb-2">
        <div
          className="w-10 h-10 rounded flex items-center justify-center text-white font-medium"
          style={{ backgroundColor: bgColor }}
        >
          {org?.name
            ? `${org.name.charAt(0).toUpperCase()}${org.name
              .charAt(org.name.length - 1)
              .toUpperCase()}`
            : ""}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="truncate text-body-medium-bold text-black leading-tight pt-3">
            {org?.name?.toUpperCase()}
          </h3>
        </div>
        <div className="flex-shrink-0 flex gap-2">

          <Button
            variant="basic"
            permission={"og:favorite::organization"}
            className={`relative z-40 transition-all duration-300 group ${isPending
              ? "cursor-not-allowed scale-95"
              : "hover:scale-110"
              }`}
            disabled={isPending}
            onClick={(e) => {
              handleFavoriteClick(e, org.id);
              setIsUpdate(!isUpdate);
            }}
            aria-label={
              org?.favorites?.some((fUser) => fUser.userId === user?.id)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill={isUpdate ? "#795CF5" : "none"}
              stroke="#795CF5"
              strokeWidth="1.5"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-all duration-200 ${isPending
                ? "opacity-50 scale-95"
                : "opacity-100 scale-100 group-hover:scale-105"
                }`}
            >
              <path d="M9.04907 2.92705C9.34843 2.00574 10.6518 2.00574 10.9511 2.92705L12.0207 6.21885C12.1546 6.63087 12.5386 6.90983 12.9718 6.90983H16.433C17.4017 6.90983 17.8045 8.14945 17.0208 8.71885L14.2206 10.7533C13.8701 11.0079 13.7235 11.4593 13.8573 11.8713L14.9269 15.1631C15.2263 16.0844 14.1718 16.8506 13.3881 16.2812L10.5879 14.2467C10.2374 13.9921 9.76279 13.9921 9.4123 14.2467L6.61213 16.2812C5.82842 16.8506 4.77394 16.0844 5.07329 15.1631L6.14286 11.8713C6.27673 11.4593 6.13007 11.0079 5.77958 10.7533L2.97941 8.71885C2.19569 8.14945 2.59847 6.90983 3.56719 6.90983H7.02839C7.46161 6.90983 7.84557 6.63087 7.97944 6.21885L9.04907 2.92705Z" />
            </svg>
          </Button>
          {organization?.id === org.id ? <div className="bg-green-500 w-3 h-3 mt-1  rounded-full text-[10px] animate-pulse"></div> :

            <Button
              variant="basic"
              permission={"og:delete::organization"}
              className="z-40 hover:scale-110 duration-300"
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(org);
              }}
            >
              <Trash color="red" fill="red" size={20} />
            </Button>
          }
        </div>
      </div>

      <div className="mt-auto">
        <div
          className="flex items-center justify-between px-2 py-1.5 rounded"
          style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
        >
          <span className="text-body-small font-medium text-primary">
            {org?.memberships?.length ?? "0"} members
          </span>
          <div className="flex items-center -space-x-0.5">
            {org?.products?.map((product, index) => (

              <Link key={product.id} href={generateProductLink(org?.products?.[index]?.oi_sub_domain!)} target="_blank" className="z-30">
                <Image
                  key={index}
                  src={`/Icons/${product.product_name}_LOGO.svg`}
                  alt={product.product_name ?? "OS"}
                  width={20}
                  height={20}
                  className="w-6 h-6 rounded-full hover:scale-110 duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
