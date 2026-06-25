"use client";
import { Link } from "@/components/ui";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";
import { IconName, SvgIcon } from "@/components/ui/SvgIcon";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { useAppSelector } from "@/redux/store";

interface OrgSidebarProps {
  collapsed: boolean;
  className?: string;
  organizationDetails: OgOrganization;
}

interface SidebarItem {
  label: string;
  href: (orgId: string) => string;
  icon: IconName;
  showForRoles: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Billings",
    href: (orgId) => `/organization-details/${orgId}/billing`,
    icon: "billing",
    showForRoles: ["OWNER", "ADMIN"],
  },
  {
    label: "Payment Cards",
    href: (orgId) => `/organization-details/${orgId}/payment-cards`,
    icon: "payment-methods",
    showForRoles: ["OWNER", "ADMIN"],
  },

  {
    label: "Notifications",
    href: (orgId) => `/organization-details/${orgId}/notifications`,
    icon: "notification",
    showForRoles: ["OWNER", "ADMIN", "MEMBER"],
  },
];

export default function OrgSidebar({
  collapsed,
  className,
  organizationDetails,
}: OrgSidebarProps) {
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const userRole = organizationDetails?.memberships?.find(
    (m) => m.user_id === user?.id,
  )?.role as string;

  return (
    <aside
      className={cn(
        "shrink-0 bg-bg-secondary border-r h-full transition-all duration-300 ease-in-out",
        collapsed ? "w-17" : "w-70",
        className,
      )}
    >
      <Link
        isShow={true}
        href="/"
        className={cn(
          "h-14 flex items-center justify-start border-b cursor-pointer",
          collapsed ? "px-3" : "px-3",
        )}
        rightIcon={
          !collapsed ? (
            <SvgIcon
              name="ownersInventory"
              className="text-foreground"
              width={130}
              height={130}
            />
          ) : (
            <SvgIcon
              name="OI"
              className="text-foreground"
              width={40}
              height={40}
            />
          )
        }
      />
      <nav className="px-3 py-1.5 space-y-1 ">
        <div
          className={cn(
            "flex items-center text-sm font-medium rounded-lg transition-colors p-2 text-icon",
            collapsed ? "justify-center bg-primary/10 " : "ml-1",
          )}
        >
          {collapsed ? (
            <span className="w-8 h-8 flex items-center justify-center text-[12px] font-semibold">
              {organizationDetails?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)}
            </span>
          ) : (
            <span className="text-[12px] font-semibold -ml-3">
              {organizationDetails?.name}
            </span>
          )}
        </div>
        {sidebarItems.map((item) => {
          const href = item.href(organizationDetails?.id);
          const isActive = pathname === href;
          const isShow = item.showForRoles.includes(userRole);
          return (
            <Link
              key={href}
              isShow={isShow}
              title={item.label}
              label={item.label}
              href={href}
              showLabel={!collapsed}
              leftIcon={
                <SvgIcon
                  name={item.icon}
                  width={20}
                  height={20}
                  className={`text-icon ${isActive ? "text-white" : ""}`}
                />
              }
              className={cn(
                "flex items-center text-sm font-medium rounded-lg transition-colors p-2",
                collapsed ? "justify-center px-0" : "p-3",
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-primary/10 hover:text-primary",
              )}
            />
          );
        })}
      </nav>
    </aside>
  );
}
