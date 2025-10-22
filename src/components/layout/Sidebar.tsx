"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icons } from "@/components/utils/icons";
import { IconName, SvgIcon } from "../ui/SvgIcon";
import { cn } from "@/utils/helpers";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
      return <Image src={Icons.pie} alt="time" width={14} height={14} />;
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
    const buttonClass = cn(
      "flex items-center transition-colors cursor-pointer hover:bg-primary",
      {
        "justify-center w-10 h-10 mx-0 rounded border-t": collapsed,
        "justify-between w-full px-2 py-1.5 rounded": !collapsed,
        "border-border shadow-md": collapsed && currentPath === "/view-all-product",
        "border-border hover:shadow-sm": collapsed && currentPath !== "/view-all-product",
        "text-white bg-primary/90": !collapsed && currentPath === "/view-all-product",
        "text-gray-600": !collapsed && currentPath !== "/view-all-product",
      }
    );

    return (
      <Link href={"/view-all-product"}
        className={buttonClass}
        title={collapsed ? "View All Products" : ""}
      >
        {collapsed ? (
          <Image src={Icons.allProducts} alt="View All Products" width={16} height={16} />
        ) : (
          <>
            <span className="font-medium p-1">View All Products</span>
            <ChevronRight />
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