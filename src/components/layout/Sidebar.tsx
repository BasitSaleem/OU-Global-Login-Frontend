"use client";

import { useRouter } from "next/navigation";
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
  svgName: IconName;
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
      svgName: "home",
      label: "Home",
      isActive: currentPath === "/",
    },
    {
      href: "/organizations",
      svgName: "organization",
      label: "Organizations",
      isActive: currentPath === "/organizations",
    },
    // {
    //   href: "/payment-cards",
    //   svgName: "payment-methods",
    //   label: "Payment Cards",
    //   isActive: currentPath === "/payment-cards",
    // },
    {
      href: "https://ownersinventory.com/",
      hasExternal: true,
      svgName: "OI",
      label: "Inventory",
      isActive: currentPath === "/ownersinventory.com",
    },
    {
      href: "https://ownerspulse.com/",
      hasExternal: true,
      svgName: "OP",
      label: "Pulse",
      isActive: currentPath === "/ownerspulse.com",
    },
    {
      href: "/marketplace",
      svgName: "OM",
      label: "Marketplace",
      hasTime: true,
      isActive: currentPath === "/marketplace",
    },
    {
      href: "/jungle",
      svgName: "OJ",
      label: "Jungle",
      hasTime: true,
      isActive: currentPath === "/jungle",
    },
    {
      href: "/analytics",
      svgName: "OA",
      label: "Analytics",
      hasTime: true,
      isActive: currentPath === "/analytics",
    },
  ];

  const handleItemClick = (item: NavigationItem, e: React.MouseEvent) => {
    e.preventDefault();
    if (item.hasTime) {
      const iconNode = <SvgIcon name={item.svgName} className="w-10 h-10" />;
      onShowModal(iconNode);
    } else {
      if (item.hasExternal) {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
    }
  };

  const renderRightSideContent = (item: NavigationItem) => {
    if (item.hasExternal) {
      return <SvgIcon name="expand" width={18} height={18} />;
    }
    if (item.hasTime) {
      return <SvgIcon name="time" width={17} height={17} />;
    }
    if (item.hasBadge && !item.isActive) {
      return (
        <span className="text-sm font-medium px-1.5 py-0.5 bg-primary/10 rounded-full text-primary">
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
        "bg-primary text-white hover:bg-primary hover:text-white":
          item.isActive,
        "justify-between":
          !collapsed && (item.hasExternal || item.hasTime || item.hasBadge),
        "gap-2": !collapsed && !item.isActive,
      },
    );

    return (
      <div
        onClick={(e) => handleItemClick(item, e)}
        className={itemClass}
        title={collapsed ? item.label : ""}
      >
        {collapsed ? (
          <div className="relative w-5 h-5 shrink-0">
            <div
              className={cn(
                "absolute inset-y-0 flex items-center justify-center",
                item.svgName === "OP" ? "w-5" : "w-5 ",
              )}
            >
              <SvgIcon
                name={item.svgName}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 ">
              <div className="relative w-5 h-5 shrink-0">
                <div
                  className={cn(
                    "absolute inset-y-0 flex items-center justify-center",
                    item.svgName === "OP" ? "w-6" : "w-5 left-0",
                  )}
                >
                  <SvgIcon
                    name={item.svgName}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
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
          : "text-gray-600",
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
            <span
              className={cn(
                "p-1",
                theme.theme === "light" ? "" : "text-invert",
              )}
            >
              View All Products
            </span>

            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "p-1 w-6 h-6",
                theme.theme === "light" ? "" : "text-invert",
              )}
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
          "border-r bg-bg-secondary shrink-0 transition-all duration-300 ease-in-out fixed lg:relative inset-y-0 left-0 z-50",
          {
            "w-17": collapsed,
            "w-70": !collapsed, //else use w-64
            "translate-x-0": mobileOpen,
            "-translate-x-full lg:translate-x-0": !mobileOpen,
          },
        )}
      >
        {/* Header */}
        <Link
          href="/"
          className={cn(
            "h-14 flex items-center border-b cursor-pointer",
            collapsed ? "justify-center px-0" : "justify-start px-3",
          )}
        >
          {collapsed ? (
            <div className="h-10 rounded-lg flex items-center justify-center">
              <SvgIcon name="ownersUniverseColl" width={30} height={30} />
            </div>
          ) : (
            <SvgIcon name="ownersUniverse" width={130} />
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
