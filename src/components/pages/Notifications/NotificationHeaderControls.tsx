'use client';
import React from 'react';
import { HiMenu } from 'react-icons/hi';

export default function NotificationsHeaderControls({
  setSidebarOpen,
  onMarkAllAsRead,
  onlyUnread,
  setOnlyUnread,
}: {
  setSidebarOpen: (open: boolean) => void;
  onMarkAllAsRead: () => void;
  onlyUnread: boolean;
  setOnlyUnread: (v: boolean) => void;
}) {
  return (
    <div className="p-4 md:p-8 pb-6 border-b border-gray-100 bg-white flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-black md:hidden">
          <HiMenu size={24} />
        </button>
        <h2 className="text-xs sm:text-lg font-medium text-black">Latest</h2>
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        <button
          onClick={onMarkAllAsRead}
          className="text-primary text-xs sm:text-[14px] text-[#795CF5] font-medium hover:underline cursor-pointer"
        >
          Mark all as read
        </button>

        {/* Adaptive label */}
        <span
          className="text-[#4B5563] text-xs sm:text-[13px] hover:underline cursor-pointer whitespace-nowrap"
          onClick={() => setOnlyUnread(!onlyUnread)}
        >
          <span className="sm:hidden">Unread</span>
          <span className="hidden sm:inline">Only show Unread</span>
        </span>

        {/* Pill switch */}
        <div
          onClick={() => setOnlyUnread(!onlyUnread)}
          className={`rounded-full p-1 cursor-pointer transition-colors ${
            onlyUnread ? 'bg-[#795CF5]' : 'bg-gray-200'
          } w-10 h-5 sm:w-12 sm:h-6`}
          role="switch"
          aria-checked={onlyUnread}
          aria-label="Only show unread notifications"
        >
          <div
            className={`bg-white rounded-full shadow transition-transform w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              onlyUnread ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
