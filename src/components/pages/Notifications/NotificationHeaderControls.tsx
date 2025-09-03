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
    <div className="p-2 md:p-3 pb-3 border-b border-gray-100 bg-white flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-600 cursor-pointer hover:text-black md:hidden">
          <HiMenu size={16} />
        </button>
        <h2 className="text-body-medium-bold text-black">Latest</h2>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onMarkAllAsRead}
          className="text-primary text-body-small text-[#795CF5] font-medium hover:underline cursor-pointer"
        >
          Mark all as read
        </button>

        {/* Adaptive label */}
        <span
          className="text-[#4B5563] text-body-small hover:underline cursor-pointer whitespace-nowrap"
          onClick={() => setOnlyUnread(!onlyUnread)}
        >
          <span className="sm:hidden">Unread</span>
          <span className="hidden sm:inline">Only show Unread</span>
        </span>

        {/* Pill switch */}
        <div
          onClick={() => setOnlyUnread(!onlyUnread)}
          className={`rounded-full p-0.5 cursor-pointer transition-colors ${
            onlyUnread ? 'bg-[#795CF5]' : 'bg-gray-200'
          } w-8 h-4 sm:w-10 sm:h-5`}
          role="switch"
          aria-checked={onlyUnread}
          aria-label="Only show unread notifications"
        >
          <div
            className={`bg-white rounded-full shadow transition-transform w-3 h-3 sm:w-3.5 sm:h-3.5 ${
              onlyUnread ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
