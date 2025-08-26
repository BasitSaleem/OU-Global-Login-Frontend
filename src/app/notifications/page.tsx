"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import NotificationItem from "@/components/layout/Notifications/NotificationItems";
import { useState } from "react";
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
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[281px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col`}
      >
        {/* Mobile close header inside sidebar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between md:hidden bg-white">
          <h1 className="text-xl font-bold">Notifications</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 hover:text-black"
          >
            <HiX size={24} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="p-8 pb-10 overflow-y-auto">
          {/* Desktop title */}
          <h1 className="text-2xl font-bold text-black mb-6 hidden md:block">
            Notifications
          </h1>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {sidebarFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveSidebarFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-base transition-colors cursor-pointer ${
                  activeSidebarFilter === filter.id
                    ? "text-primary"
                    : "text-black hover:bg-gray-50"
                }`}
                style={
                  activeSidebarFilter === filter.id
                    ? { backgroundColor: "#795CF512", color: "#795CF5" }
                    : {}
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Products Section */}
          <div>
            <h3 className="text-base font-medium text-black mb-2">PRODUCTS</h3>
            <div className="space-y-1">
              {productFilters.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setActiveProductFilter(product.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-base transition-colors cursor-pointer ${
                    activeProductFilter === product.id
                      ? "text-primary"
                      : "text-black hover:bg-gray-50"
                  }`}
                  style={
                    activeProductFilter === product.id
                      ? { backgroundColor: "#795CF512", color: "#795CF5" }
                      : {}
                  }
                >
                  {product.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Page Header */}
        <div className="p-4 md:p-8 pb-6 border-b border-gray-100 bg-white flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger toggle (only for sidebar) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-black md:hidden"
            >
              <HiMenu size={24} />
            </button>
            <h2 className="text-lg font-medium text-black">Latest</h2>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <button
              onClick={markAllAsRead} // ⬅️ add this
              className="text-primary text-xs sm:text-lg text-[#795CF5] font-medium hover:underline cursor-pointer"
            >
              Mark all as read
            </button>

            <p className="text-[#4B5563] text-xs sm:text-lg hover:underline cursor-pointer"
            onClick={() => setOnlyUnread((prev) => !prev)}
            >Only show Unread</p>
            <div
              onClick={() => setOnlyUnread((prev) => !prev)}
              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors hidden sm:block ${
                onlyUnread ? "bg-[#795CF5]" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  onlyUnread ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Notifications List */}
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

export default function Page() {
  return (
    <DashboardLayout>
      <NotificationsPage />
    </DashboardLayout>
  );
}
