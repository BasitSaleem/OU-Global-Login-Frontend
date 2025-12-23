"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconName, SvgIcon } from "../ui/SvgIcon";
import { cn } from "@/utils/helpers";
import Link from "next/link";
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
  image?: string;
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
      // image: Icons.home,
      // activeImage: Icons.homewhite,
      label: "Home",
      isActive: currentPath === "/",
    },
    {
      href: "/organizations",
      type: "svg",
      svgName: "organization",
      // image: Icons.organization,
      // activeImage: Icons.organizationwhite,
      label: "Organizations",
      isActive: currentPath === "/organizations",
    },
    // {
    //   href: "/payment-methods",
    //   type: "svg",
    //   svgName: "payment-methods",
    //   // image: Icons.organization,
    //   label: "Payment Methods",
    //   isActive: currentPath === "/payment-methods",
    // },
    // {
    //   href: "/billing",
    //   type: "svg",
    //   svgName: "billing",
    //   // image: Icons.organization,
    //   label: "billing",
    //   isActive: currentPath === "/billing",`
    // },
    {
      href: "https://ownersinventory.com/",
      type: "svg",
      hasExternal: true,
      svgName: 'OI',
      label: "Inventory",
      isActive: currentPath === "/ownersinventory.com",
    },
    {
      href: "/marketplace",
      type: "svg",
      svgName: 'OM',
      label: "Marketplace",
      hasTime: true,
      isActive: currentPath === "/marketplace",
    },
    {
      href: "/jungle",
      type: "svg",
      svgName: 'OJ',
      label: "Jungle",
      hasTime: true,
      isActive: currentPath === "/jungle",
    },
    {
      href: "/analytics",
      type: "svg",
      hasTime: false,
      svgName: 'OA',
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
        <Image src={item.href} alt={item.label} className="w-10 h-10" />
      );
      onShowModal(iconNode);
    } else {
      if (item.hasExternal) {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
    }
  };

  const renderIcon = (item: NavigationItem, isCollapsed: boolean) => {
    const iconClass = cn(
      `cursor-pointer transition-colors ${item.isActive ? "" : "text-icon"}`,
    );

    if (item.type === "svg" && item.svgName) {
      return <SvgIcon name={item.svgName} className={iconClass} width={20} height={20} />;
    }

    return (
      <SvgIcon name={item.svgName!} className={iconClass} width={20} height={20} />
    );
  };

  const renderRightSideContent = (item: NavigationItem) => {
    if (item.hasExternal) {
      return <SvgIcon name="expand" width={18} height={18} />;
    }
    // #4B5563
    if (item.hasTime) {
      return <SvgIcon name="time" width={17} height={17} />;
    }

    if (item.hasBadge && !item.isActive) {
      return (
        <span
          className="text-sm font-medium px-1.5 py-0.5 bg-primary/10 rounded-full text-primary"
        >
          TRY
        </span>
      );
    }

    return null;
  };

  const NavigationItem = ({ item }: { item: NavigationItem }) => {
    const itemClass = cn(
      "flex cursor-pointer font-medium items-center hover:bg-primary/10 py-2 rounded-lg transition-colors hover:text-primary",
      {
        "justify-center px-0": collapsed,
        "px-2": !collapsed,
        "bg-primary text-white hover:bg-primary hover:text-white": item.isActive,
        "justify-between": !collapsed && (item.hasExternal || item.hasTime || item.hasBadge),
        "gap-2": !collapsed && !item.isActive,
      }
    );

    return (
      <div
        // target={item.hasExternal ? "_blank" : "_self"}
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
      </div>
    );
  };

  const ViewAllProductsButton = () => {
    const isActive = currentPath === "/view-all-product";

    const buttonClass = cn(
      "flex items-center transition-colors cursor-pointer hover:bg-primary/10 hover:text-primary",
      collapsed
        ? "justify-center w-10 h-10 mx-0  border-t"
        : "justify-between w-full px-2 py-1.5 rounded-lg",
      collapsed
        ? isActive
          ? "border-border"
          : "border-border"
        : isActive
          ? "text-primary bg-primary/10 "
          : "text-gray-600"
    );

    return (
      <Link
        href="/view-all-product"
        className={buttonClass}
        title={collapsed ? "View All Products" : ""}
      >
        {collapsed ? (
          <SvgIcon name="AllProducts" width={20} height={20} />
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
              className={cn("p-1 w-6 h-6", theme.theme === "light" ? "" : "text-invert")}
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
            "w-70": !collapsed,//else use w-64 
            "translate-x-0": mobileOpen,
            "-translate-x-full lg:translate-x-0": !mobileOpen,
          }
        )}
      >
        {/* Header */}
        <Link
          href="/"
          className={cn(
            "h-14  flex items-center justify-start border-b cursor-pointer",
            collapsed ? "px-3" : "px-3"
          )}
        >
          {collapsed ? (
            <div className="w-20 h-10 rounded-lg flex items-center justify-center bg-primary/10">
              <SvgIcon name="ownersUniverseColl" width={20} height={20} />
            </div>
          ) : (
            <SvgIcon
              name="ownersUniverse"
              className="text-foreground"
              width={130}
              height={130}
            />
          )}
        </Link>

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