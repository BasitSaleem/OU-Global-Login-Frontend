"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import NotificationsHeaderControls from "@/components/pages/Notifications/NotificationHeaderControls";
import NotificationItem from "@/components/pages/Notifications/NotificationItems";
import NotificationsSidebar from "@/components/pages/Notifications/NotificationSidebar";
import { Suspense, useEffect, useState } from "react";
import { useGetInvitations } from "@/apiHooks.ts/invitation/invitation.api";

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active filters
  const [activeSidebarFilter, setActiveSidebarFilter] = useState("all");
  const [activeProductFilter, setActiveProductFilter] =
    useState("all-products");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const sidebarFilters = [
    { id: "all", label: "All" },
    { id: "today", label: "Today" },
  ];

  const productFilters = [
    { id: "all-products", label: "All Products" },
    { id: "owners-inventory", label: "Owners Inventory" },
    { id: "owners-marketplace", label: "Owners Marketplace" },
  ];

  const { data: invitesResp, isLoading, isSuccess } = useGetInvitations();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isSuccess && invitesResp) {
      const colors = ["#137F6A", "#B11E67", "#1AD1B9", "#FF7C3B", "#795CF5"];
      const mapped = invitesResp.map((invite, index) => {
        const fName = invite.inviter?.first_name || "";
        const lName = invite.inviter?.last_name || "";
        const initials = `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase() || "IN";

        return {
          id: invite.id,
          avatar: initials,
          avatarColor: colors[index % colors.length],
          name: `${fName} ${lName}`.trim() || "Unknown User",
          action: "invited you to organization",
          title: invite.organization?.name || "Organization",
          subtitle: "Organization Invitation",
          updates: "",
          time: getTimeAgo(invite.createdAt),
          hasUnreadDot: true,
          hasMarkAsRead: false,
        };
      });
      setNotifications(mapped);
    }
  }, [invitesResp]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, hasUnreadDot: false }))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeSidebarFilter === "today") {
      const isToday =
        n.time.includes("Just now") ||
        n.time.includes("mins ago") ||
        n.time.includes("hour") ||
        n.time.includes("hours ago");
      if (!isToday) return false;
    }
    if (onlyUnread && !n.hasUnreadDot) return false;

    // 🔹 Product filter
    if (activeProductFilter === "owners-inventory") {
      return n.subtitle?.toLowerCase().includes("owners inventory");
    }
    if (activeProductFilter === "owners-marketplace") {
      return n.subtitle?.toLowerCase().includes("owners marketplace");
    }

    // 🔹 Default: pass through
    return true;
  });

  return (
    <div className="flex bg-background">
      <NotificationsSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarFilters={sidebarFilters}
        activeSidebarFilter={activeSidebarFilter}
        setActiveSidebarFilter={setActiveSidebarFilter}
        productFilters={productFilters}
        activeProductFilter={activeProductFilter}
        setActiveProductFilter={setActiveProductFilter}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <NotificationsHeaderControls
          setSidebarOpen={setSidebarOpen}
          onMarkAllAsRead={markAllAsRead}
          onlyUnread={onlyUnread}
          setOnlyUnread={setOnlyUnread}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-1 sm:p-3 pt-2">
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center py-4">Loading notifications...</div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    initials={n.avatar}
                    color={n.avatarColor!}
                    name={n.name}
                    action={n.action}
                    time={n.time}
                    showDot={n.hasUnreadDot}
                    title={n.title}
                    description={n.subtitle}
                    updates={n.updates}
                    onMarkAsRead={() =>
                      setNotifications((prev) =>
                        prev.map((notif) =>
                          notif.id === n.id
                            ? { ...notif, hasUnreadDot: false }
                            : notif
                        )
                      )
                    }
                  />
                ))
              ) : (
                <p className=" text-center py-4">
                  No notifications found for this filter.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <div className="text-center space-y-2 animate-pulse">
        <div className="h-4 w-32 bg-background rounded mx-auto" />
        <div className="h-3 w-48 bg-background rounded mx-auto" />
        <div className="space-y-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-[400px] max-w-full bg-bg-secondary rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsPage />
      </Suspense>
    </DashboardLayout>
  );
}
