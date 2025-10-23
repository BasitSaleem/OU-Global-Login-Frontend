"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icons } from "@/components/utils/icons";
import { IconName, SvgIcon } from "../ui/SvgIcon";
import { cn } from "@/utils/helpers";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  currentPath?: string;
  onShowModal: (icon: React.ReactNode) => void;
}

interface NavigationItem {
  href: string;
  type: "svg" | "image";
  svgName?: IconName
  image: string;
  activeImage?: string;
  label: string;
  isActive: boolean;
  hasExternal?: boolean;
  hasTime?: boolean;
  hasBadge?: boolean;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleMobile,
  currentPath = "/",
  onShowModal,
}: SidebarProps) {
  const router = useRouter();
  const theme = useTheme();

  const navigationItems: NavigationItem[] = [
    {
      href: "/",
      type: "svg",
      svgName: "home",
      image: Icons.home,
      activeImage: Icons.homewhite,
      label: "Home",
      isActive: currentPath === "/",
    },
    {
      href: "/organizations",
      type: "svg",
      svgName: "organization",
      image: Icons.organization,
      activeImage: Icons.organizationwhite,
      label: "Organizations",
      isActive: currentPath === "/organizations",
    },
    {
      href: "/inventory",
      type: "image",
      label: "Inventory",
      image: '/Icons/OI_LOGO.svg',
      hasTime: true,
      isActive: currentPath === "/inventory",
    },
    {
      href: "/marketplace",
      type: "image",
      label: "Marketplace",
      image: '/Icons/OM_LOGO.svg',
      hasTime: true,
      isActive: currentPath === "/marketplace",
    },
    {
      href: "/jungle",
      type: "image",
      label: "Jungle",
      image: '/Icons/OJ_LOGO.svg',
      hasTime: true,
      isActive: currentPath === "/jungle",
    },
    {
      href: "/analytics",
      type: "image",
      image: '/Icons/OA_LOGO.svg',
      label: "Analytics",
      hasBadge: true,
      isActive: currentPath === "/analytics",
    },
  ];

  const handleItemClick = (item: NavigationItem, e: React.MouseEvent) => {
    e.preventDefault();

    if (item.hasTime) {
      const iconNode = item.type === "svg" && item.svgName ? (
        <SvgIcon name={item.svgName} className="w-10 h-10" />
      ) : (
        <img src={item.image} alt={item.label} className="w-10 h-10" />
      );
      onShowModal(iconNode);
    } else {
      router.push(item.href);
    }
  };

  const renderIcon = (item: NavigationItem, isCollapsed: boolean) => {
    const iconSrc = item.isActive && item.activeImage ? item.activeImage : item.image;
    const iconClass = cn(
      "w-6 h-6 cursor-pointer transition-colors",
      {
        "text-white": item.isActive,
        "text-foreground": !item.isActive,
      }
    );

    if (item.type === "svg" && item.svgName) {
      return <SvgIcon name={item.svgName} className={iconClass} />;
    }

    return (
      <img
        src={iconSrc}
        alt={item.label}
        className={cn("w-6 h-6", {
          "brightness-0 invert": item.isActive && item.type === "image",
        })}
      />
    );
  };

  const renderRightSideContent = (item: NavigationItem) => {
    if (item.hasExternal) {
      return <Image src={Icons.expand} alt="external" width={12} height={12} />;
    }

    if (item.hasTime) {
      return <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 0.0146484C13.4617 0.273463 17 3.97343 17 8.5C17 13.1944 13.1944 17 8.5 17C3.80558 17 0 13.1944 0 8.5C0 3.80558 3.80558 0 8.5 0H9V0.0146484ZM9 7.15625C9.50846 7.29002 9.88379 7.75228 9.88379 8.30273C9.88371 8.55046 9.8077 8.7805 9.67773 8.9707L10.4346 9.72754L10.0811 10.0811L9.31348 9.31348C9.13372 9.42319 8.92327 9.48828 8.69727 9.48828C8.04255 9.48806 7.51194 8.95745 7.51172 8.30273C7.51172 8.07661 7.57573 7.86537 7.68555 7.68555L3.19629 3.19629C1.83906 4.55352 1 6.42893 1 8.5C1 12.6421 4.35786 16 8.5 16C12.6421 16 16 12.6421 16 8.5C16 4.52593 12.9089 1.27592 9 1.01855V7.15625ZM7.70703 7L8.02832 7.32129C8.16692 7.22654 8.32766 7.16273 8.5 7.13379V7H7.70703ZM7.10742 6.40039H8.5V6H6.70703L7.10742 6.40039ZM6.10742 5.40039H8.5V5H5.70703L6.10742 5.40039ZM5.10742 4.40039H8.5V4H4.70703L5.10742 4.40039ZM4.10742 3.40039H8.5V3H3.70703L4.10742 3.40039ZM8.5 1C6.87273 1 5.36771 1.51982 4.13867 2.40039H8.5V1Z" fill="currentColor" />
      </svg>
    }

    if (item.hasBadge && !item.isActive) {
      return (
        <span
          className="text-body-tiny font-medium px-1.5 py-0.5 rounded-full"
          style={{
            // backgroundColor: "rgba(121, 92, 245, 0.07)",
            // color: "#795CF5",
          }}
        >
          TRY
        </span>
      );
    }

    return null;
  };

  const NavigationItem = ({ item }: { item: NavigationItem }) => {
    const itemClass = cn(
      "flex cursor-pointer items-center hover:bg-primary/80 py-1 rounded transition-colors",
      {
        "justify-center px-0": collapsed,
        "px-2": !collapsed,
        "bg-primary text-[#ffff]": item.isActive,
        "justify-between": !collapsed && (item.hasExternal || item.hasTime || item.hasBadge),
        "gap-2": !collapsed && !item.isActive,
      }
    );

    return (
      <a
        onClick={(e) => handleItemClick(item, e)}
        className={itemClass}
        title={collapsed ? item.label : ""}
      >
        {collapsed ? (
          renderIcon(item, true)
        ) : (
          <>
            <div className="flex items-center gap-3 ">
              {renderIcon(item, false)}
              <span className={cn("", { "font-medium": item.isActive })}>
                {item.label}
              </span>
            </div>
            {renderRightSideContent(item)}
          </>
        )}
      </a>
    );
  };

const ViewAllProductsButton = () => {
  const isActive = currentPath === "/view-all-product";

  const buttonClass = cn(
    "flex items-center transition-colors cursor-pointer hover:bg-primary hover:text-btn-text",
    collapsed
      ? "justify-center w-10 h-10 mx-0 rounded border-t"
      : "justify-between w-full px-2 py-1.5 rounded",
    collapsed
      ? isActive
        ? "border-border shadow-md"
        : "border-border hover:shadow-sm"
      : isActive
        ? "text-white bg-primary/90"
        : "text-gray-600"
  );

  return (
    <Link
      href="/view-all-product"
      className={buttonClass}
      title={collapsed ? "View All Products" : ""}
    >
      {collapsed ? (
        <Image
          src={Icons.allProducts}
          alt="View All Products"
          width={16}
          height={16}
        />
      ) : (
        <>
          <span className={cn("p-1", theme.theme === "light" ? "" : "text-invert")}>
            View All Products
          </span>

          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 2L13 9.5L5 17"
              stroke="currentColor"
              strokeWidth="1.875"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}
    </Link>
  );
};


  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={onToggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "border-r bg-bg-secondary flex-shrink-0 transition-all duration-300 ease-in-out fixed lg:relative inset-y-0 left-0 z-50",
          {
            "w-17": collapsed,
            "w-70": !collapsed,
            "translate-x-0": mobileOpen,
            "-translate-x-full lg:translate-x-0": !mobileOpen,
          }
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "h-14 flex items-center justify-start border-b cursor-pointer",
            collapsed ? "px-3" : "px-3"
          )}
        >
          {collapsed ? (
            <div className="w-9 h-9 rounded flex items-center justify-center bg-primary/50">
              <SvgIcon name="ownersUniverseColl" className=" w-[18px] h-[18px]" />
            </div>
          ) : (
            <SvgIcon
              name="ownersUniverse"
              className="text-foreground"
              width={130}
              height={130}
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="px-3 py-1.5 space-y-1 ">
          {navigationItems.map((item) => (
            <NavigationItem key={item.href} item={item} />
          ))}

          {/* View All Products - Collapsed */}
          {collapsed && (
            <div className="px-2 -ml-1 mt-2">
              <ViewAllProductsButton />
            </div>
          )}
        </nav>

        {/* View All Products - Expanded */}
        {!collapsed && (
          <div className="px-2 py-3 mt-4 pt-3 border-t">
            <ViewAllProductsButton />
          </div>
        )}
      </aside>
    </>
  );
}