"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import NotificationsHeaderControls from "@/components/pages/Notifications/NotificationHeaderControls";
import NotificationItem from "@/components/pages/Notifications/NotificationItems";
import NotificationsSidebar from "@/components/pages/Notifications/NotificationSidebar";
import { Suspense, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

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

  // 🔹 Keep notifications in state so we can update the unread dot
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      avatar: "BS",
      avatarColor: "#137F6A",
      name: "Basit Saleem",
      action: "updated a page",
      title: "Owners AI Bot",
      subtitle: "Al-Asif • Owners Inventory",
      updates: "+3 updates from Basit Saleem",
      time: "Just now",
      hasUnreadDot: true,
      hasMarkAsRead: true,
    },
    {
      id: 2,
      avatar: "JS",
      avatarColor: "#B11E67",
      name: "John Smith",
      action: "updated a page",
      title: "Editors AI Bot",
      subtitle: "Sportifi • Owners Inventory",
      updates: "+2 updates from John Smith",
      time: "2 mins ago",
      hasUnreadDot: true,
      hasMarkAsRead: false,
    },
    {
      id: 3,
      avatar: "AS",
      avatarColor: "#1AD1B9",
      name: "Alice Sanders",
      action: "updated a page",
      title: "Managers AI Bot",
      subtitle: "RS-Managers-Inventory",
      updates: "+1 update from Alice Sanders",
      time: "1 days ago",
      hasUnreadDot: false,
      hasMarkAsRead: false,
    },
    {
      id: 4,
      avatar: "TH",
      avatarColor: "#FF7C3B",
      name: "Tom Hanks",
      action: "updated a page",
      title: "Admins AI Bot",
      subtitle: "owners Marketplace",
      updates: "+5 updates from Tom Hanks",
      time: "1 week ago",
      hasUnreadDot: false,
      hasMarkAsRead: false,
    },
    {
      id: 5,
      avatar: "DS",
      avatarColor: "#F95C5B",
      name: "David Smith",
      action: "updated a page",
      title: "Supervisors AI Bot",
      subtitle: "RS-Supervisors-Inventory",
      updates: "+4 updates from David Smith",
      time: "2 weeks ago",
      hasUnreadDot: true,
      hasMarkAsRead: false,
    },
    {
      id: 6,
      avatar: "EM",
      avatarColor: "#795CF5",
      name: "Emma Moore",
      action: "updated a page",
      title: "Developers AI Bot",
      titleColor: "#795CF5",
      subtitle: "RS-Developers-Inventory",
      updates: "+6 updates from Emma Moore",
      updatesColor: "#795CF5",
      time: "1 month ago",
      hasUnreadDot: true,
      hasMarkAsRead: false,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, hasUnreadDot: false }))
    );
  };

  // 🔹 Dummy filtered data (for now, just filter by product type ID or sidebar ID)
  const filteredNotifications = notifications.filter((n) => {
    // 🔹 Sidebar filter
    if (activeSidebarFilter === "today") {
      const isToday =
        n.time.includes("Just now") ||
        n.time.includes("mins ago") ||
        n.time.includes("hour") ||
        n.time.includes("hours ago");
      if (!isToday) return false;
    }
    // 🔹 Unread toggle
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
    <div className="flex bg-white">
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

        {/* Feed stays inline with your NotificationItem */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-1 sm:p-8 pt-6">
            <div className="space-y-2">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    initials={n.avatar}
                    color={n.avatarColor}
                    name={n.name}
                    action={n.action}
                    time={n.time}
                    showDot={n.hasUnreadDot}
                    title={n.title}
                    description={n.subtitle}
                    updates={n.updates}
                    onMarkAsRead={() =>
                      setNotifications(prev =>
                        prev.map(notif =>
                          notif.id === n.id ? { ...notif, hasUnreadDot: false } : notif
                        )
                      )
                    }
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-10">
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

// 🔹 Skeleton Loader (overlay style)
function NotificationsSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <div className="text-center space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mx-auto" />
        <div className="h-4 w-72 bg-gray-200 rounded mx-auto" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 w-[500px] max-w-full bg-gray-200 rounded"
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


