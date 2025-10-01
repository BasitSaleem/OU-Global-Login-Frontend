"use client";

import Image from "next/image";
import React from "react";
import { Icons } from "@/components/utils/icons";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { useIsFavorite } from "@/apiHooks.ts/organization/organization.api";
import { useAppSelector } from "@/redux/store";

// interface Org {
//   id: string;
//   isAddNew?: boolean;
//   name?: string;
//   abbreviation?: string;
//   backgroundColor?: string;
//   memberships?: number[];
//   teamAvatars?: string[];
// };

export default function OrganizationGrid({
  organizations = [],
  onAddNew,
}: {
  organizations: OgOrganization[];
  onAddNew: () => void;
}) {
  const { user } = useAppSelector((s) => s.auth)
  const { mutate: toggleFavorite, isPending } = useIsFavorite()
  const handleFavoriteClick = (orgId: string) => {
    if (!user?.id) return;
    toggleFavorite({ userId: user.id, orgId });
    console.log(user);

  };
  return (
    <div>
      {/* Header with count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-heading-1 font-bold text-black">
            Your Organizations
          </h1>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-body-tiny font-medium"
            style={{ backgroundColor: "#795CF5" }}
          >
            {Math.max((organizations?.length || 0)) - 1}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {organizations?.map((org) => (
          <div
            key={org?.id}
            onClick={() => org?.isAddNew && onAddNew()}
            className={`relative group ${org?.isAddNew ? "" : "bg-white border border-gray-200"
              } rounded ${org?.isAddNew ? "" : "p-3"
              } hover:shadow-sm transition-shadow cursor-pointer`}
          >
            {org?.isAddNew ? (
              /* Add New Card */
              <div
                className="flex flex-col items-center justify-center text-center h-full rounded"
                style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
              >
                <div className="mb-2">
                  <Image
                    src={Icons.addNew}
                    width={40}
                    height={40}
                    alt="Add New"
                  />
                </div>
                <span className="text-body-medium font-medium text-primary">
                  Add New
                </span>
              </div>
            ) : (
              /* Organization Card */
              <div className="flex flex-col h-[100px]">
                {/* Top section */}
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-white text-body-small font-medium"
                    style={{ backgroundColor: "#137F6A" }}
                  >
                    {/* {org?.abbreviation} */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate text-body-medium-bold text-black leading-tight pt-3">
                      {org?.name}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      className=" z-40 hover:bg-amber-400 "
                      disabled={isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteClick(org.id);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill={org?.favorites?.some((fUser) => fUser.id === user?.id) ? "#FFD700" : "none"}
                        stroke="#795CF5"
                        strokeWidth="1.5"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.04907 2.92705C9.34843 2.00574 10.6518 2.00574 10.9511 2.92705L12.0207 6.21885C12.1546 6.63087 12.5386 6.90983 12.9718 6.90983H16.433C17.4017 6.90983 17.8045 8.14945 17.0208 8.71885L14.2206 10.7533C13.8701 11.0079 13.7235 11.4593 13.8573 11.8713L14.9269 15.1631C15.2263 16.0844 14.1718 16.8506 13.3881 16.2812L10.5879 14.2467C10.2374 13.9921 9.76279 13.9921 9.4123 14.2467L6.61213 16.2812C5.82842 16.8506 4.77394 16.0844 5.07329 15.1631L6.14286 11.8713C6.27673 11.4593 6.13007 11.0079 5.77958 10.7533L2.97941 8.71885C2.19569 8.14945 2.59847 6.90983 3.56719 6.90983H7.02839C7.46161 6.90983 7.84557 6.63087 7.97944 6.21885L9.04907 2.92705Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bottom purple section */}
                <div className="mt-auto">
                  <div
                    className="flex items-center justify-between px-2 py-1.5 rounded"
                    style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
                  >
                    <span className="text-body-small font-medium text-primary">
                      {org?.memberships?.length} members
                    </span>
                    <div className="flex items-center -space-x-0.5">
                      {org?.products?.map((avatarUrl, index) => (
                        <img
                          key={index}
                          src={avatarUrl}
                          alt={`Team member ${index + 1}`}
                          className="w-4 h-4 rounded-full border border-white"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tooltip */}
            {!org?.isAddNew && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block">
                <div className="relative bg-white border border-gray-200 shadow-md rounded px-2 py-0.5 text-body-tiny text-gray-800 whitespace-nowrap">
                  {org?.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white border-l border-t border-gray-200 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="mt-4 flex justify-end">
        <button className="text-[#795CF5] text-body-medium font-medium hover:underline cursor-pointer">
          View More
        </button>
      </div>
    </div>
  );
}
