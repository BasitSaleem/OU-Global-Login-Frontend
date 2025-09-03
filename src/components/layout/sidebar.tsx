"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icons } from "@/components/utils/icons"; // 👈 import your icons

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onToggleMobile: () => void;
  currentPath?: string;
  onShowModal: (icon: React.ReactNode) => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onToggleMobile,
  currentPath = "/",
  onShowModal,
}: SidebarProps) {
  const router = useRouter();

  const navigationItems = [
    {
      href: "/",
      icon: "local",
      image: Icons.home,
      activeImage: Icons.homewhite, // ✅ white version
      label: "Home",
      isActive: currentPath === "/",
    },
    {
      href: "/organizations",
      icon: "local",
      image: Icons.organization,
      activeImage: Icons.organizationwhite, // ✅ white version
      label: "Organizations",
      isActive: currentPath === "/organizations",
    },
    {
      href: "/inventory",
      icon: "image",
      label: "Inventory",
      hasExternal: false,
      image: Icons.ownerinventory,
      hasTime: true,
      isActive: currentPath === "/inventory",
    },
    {
      href: "/marketplace",
      icon: "image",
      label: "Marketplace",
      image: Icons.ownermarketplace,
      hasTime: true,
      isActive: currentPath === "/marketplace",
    },
    {
      href: "/jungle",
      icon: "image",
      label: "Jungle",
      image: Icons.ownerjungle,
      hasTime: true,
      isActive: currentPath === "/jungle",
    },
    {
      href: "/analytics",
      icon: "image",
      image: Icons.owneranalytics,
      label: "Analytics",
      hasBadge: true,
      isActive: currentPath === "/analytics",
    },
  ];

  const handleItemClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    if (item.hasTime) {
      const iconNode =
        item.icon === "image" ? (
          <img
            src={item.image}
            alt={item.label}
            className="w-[40px] h-[40px]"
          />
        ) : (
          <Image
            src={item.image}
            alt={item.label}
            width={40}
            height={40}
          />
        );
      onShowModal(iconNode);
    } else {
      router.push(item.href);
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onToggleMobile}
        />
      )}

      <aside
        className={`
          ${collapsed ? "w-12" : "w-70"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out
          fixed lg:relative inset-y-0 left-0 z-50 bg-white
        `}
      >
        {/* Logo */}
        <div
          className={`h-14 flex items-center justify-start border-b border-gray-200 cursor-pointer ${
            collapsed ? "px-2" : "px-3"
          }`}
        >
          {collapsed ? (
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: "#795CF5" }}
            >
              <Image
                src={Icons.owneruniversecoll}
                alt="Owners Universe Logo"
                width={18}
                height={18}
              />
            </div>
          ) : (
            <div>
              <Image
                src={Icons.owneruniverse}
                alt="Owners Universe Logo"
                width={130}
                height={130}
                className="h-10"
                onClick={() => router.push("/")}
              />

             </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-2 py-1 space-y-3">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              onClick={(e) => handleItemClick(item, e)}
              className={`
                flex cursor-pointer items-center
                ${collapsed ? "justify-center px-0" : "px-2"}
                py-1 rounded transition-colors
                ${
                  item.isActive
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
                ${!collapsed && !item.isActive ? "gap-2" : ""}
                ${
                  !collapsed &&
                  (item.hasExternal || item.hasTime || item.hasBadge)
                    ? "justify-between"
                    : ""
                }
              `}
              style={item.isActive ? { backgroundColor: "#795CF5" } : {}}
              title={collapsed ? item.label : ""}
            >
              {collapsed ? (
                item.icon === "image" ? (
                  <img
                   src={
        item.isActive && item.activeImage
          ? item.activeImage
          : item.image
      }
                    alt={item.label}
                    className="w-5 h-5 cursor-pointer"
                  />
                ) : (
                  <Image
                    src={
        item.isActive && item.activeImage
          ? item.activeImage
          : item.image
      }
                    alt={item.label}
                    width={16}
                    height={16}
                  />
                )
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    {item.icon === "image" ? (
                      <img
                      src={
                      item.isActive && item.activeImage
                        ? item.activeImage
                        : item.image
                    }
                        alt={item.label}
                        className="w-6 h-6"
                      />
                    ) : (
                      <div className={`${collapsed ? "px-0" : ""}`}>
                      <Image
                      src={
                      item.isActive && item.activeImage
                        ? item.activeImage
                        : item.image
                    }
                        alt={item.label}
                        width={24}
                        height={24}

                      />
                      </div>
                    )}
                    <span
                      className={`text-body-medium ${
                        item.isActive ? "font-medium" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Right side icons/badges */}
                  {item.hasExternal && (
                    <Image
                      src={Icons.expand}
                      alt="external"
                      width={12}
                      height={12}
                    />
                  )}
                  {item.hasTime && (
                    <Image
                      src={Icons.pie}
                      alt="time"
                      width={14}
                      height={14}
                    />
                  )}
                  {item.hasBadge && !item.isActive && (
                    <span
                      className="text-body-tiny font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(121, 92, 245, 0.07)",
                        color: "#795CF5",
                      }}
                    >
                      TRY
                    </span>
                  )}
                </>
              )}
            </a>
          ))}

          {/* View All Products - collapsed */}
          {collapsed && (
            <div className="px-0 -ml-1 mt-2">
              <a
                onClick={() => router.push("/view-all-product")}
                className={`
                  flex items-center justify-center w-10 h-10 mx-0 rounded border-t transition-all cursor-pointer
                  ${
                    currentPath === "/view-all-product"
                      ? "border-white shadow-md"
                      : "border-white hover:shadow-sm"
                  }
                `}
                style={{ backgroundColor: "#795CF5" }}
                title="View All Products"
              >
                <Image
                  src={Icons.allProducts}
                  alt="View All Products"
                  width={16}
                  height={16}
                />
              </a>
            </div>
          )}
        </nav>

        {/* View All Products - expanded */}
        {!collapsed && (
          <div className="px-2 py-3 mt-4 pt-3 border-t border-gray-200">
            <a
              onClick={() => router.push("/view-all-product")}
              className={`
                flex items-center justify-between w-full px-2 py-1.5 rounded transition-colors cursor-pointer
                ${
                  currentPath === "/view-all-product"
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
              style={
                currentPath === "/view-all-product"
                  ? { backgroundColor: "#795CF5" }
                  : {}
              }
            >
              <span className="text-body-medium font-medium p-1 ">View All Products</span>
              <Image
                src={Icons.arrowRight}
                alt="Arrow Right"
                width={14}
                height={14}
              />
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
