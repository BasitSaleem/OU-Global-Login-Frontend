'use client';
import { Button } from '@/components/ui';
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
    <div className="p-2 md:p-3 pb-3 border-b bg-bg-secondary flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button onClick={() => setSidebarOpen(true)} className=" cursor-pointer hover:text-black md:hidden">
          <HiMenu size={16} />
        </button>
        <h2 className="text-body-medium-bold">Latest</h2>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onMarkAllAsRead}
          className="text-primary text-[14px]  font-medium hover:underline cursor-pointer"
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
        <Button
          onClick={() => setOnlyUnread(!onlyUnread)}
          variant='basic'
          className={`w-12 h-6 rounded-full cursor-pointer p-1 hidden sm:flex items-center transition-colors border bg-primary ${onlyUnread ? "bg-primary" : "bg-gray-200"
            }`}
          role="switch"
          aria-checked={onlyUnread}
          aria-label="Only show unread notifications"
        >
          <span
            className={`w-4 h-4 bg-white rounded-full transition-transform mr-6  ${onlyUnread ? "translate-x-6" : "translate-x-0"
              }`}
          />
        </Button>
      </div>
    </div>
  );
}
