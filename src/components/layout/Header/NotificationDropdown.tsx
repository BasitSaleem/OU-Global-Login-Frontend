import NotificationItem from "@/components/pages/Notifications/NotificationItems";
import { NotificationItemProps } from "./Header.types";
import Link from "next/link";
import { Button } from "@/components/ui";

export function NotificationsDropdown({
    anyUnread,
    unreadOnly,
    setUnreadOnly,
    filteredNotifications,
    notifications,
    onMarkAllAsRead,
    onMarkOneAsRead,
}: {
    anyUnread: boolean;
    unreadOnly: boolean;
    setUnreadOnly: (v: boolean) => void;
    filteredNotifications: NotificationItemProps[];
    notifications: NotificationItemProps[];
    onMarkAllAsRead: () => void;
    onMarkOneAsRead: (idx: number) => void;
}) {
    return (
        <div className="absolute -right-20 sm:right-0 top-10 w-[300px] max-[300px]:w-[200px] sm:w-[450px] md:w-[500px] bg-bg-secondary border rounded-lg shadow-lg z-50 max-h-[600px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b ">
                <h2 className="text-heading-2 font-bold ">Notifications</h2>
                <Link
                    href="/notifications"
                    className="text-[14px] text-primary font-medium underline hover:no-underline"
                >
                    View All
                </Link>
            </div>

            {/* Controls */}
            <NotificationsControlsRow
                anyUnread={anyUnread}
                onMarkAllAsRead={onMarkAllAsRead}
                unreadOnly={unreadOnly}
                setUnreadOnly={setUnreadOnly}
            />

            {/* List */}
            <div className="max-h-[600px] overflow-y-auto cursor-pointer">
                {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">
                        {unreadOnly
                            ? "You're all caught up! No unread notifications."
                            : "No notifications to show."}
                    </div>
                ) : (
                    filteredNotifications.map((item, index) => {
                        // map index back to original list index for per-item mark-as-read
                        const originalIndex = notifications.findIndex(
                            (n) =>
                                n.initials === item.initials &&
                                n.time === item.time &&
                                n.title === item.title
                        );
                        return (
                            <NotificationItem
                                key={`${item.title}-${item.time}-${index}`}
                                {...item}
                                onMarkAsRead={() =>
                                    onMarkOneAsRead(originalIndex >= 0 ? originalIndex : index)
                                }
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
function NotificationsControlsRow({
    anyUnread,
    onMarkAllAsRead,
    unreadOnly,
    setUnreadOnly,
}: {
    anyUnread: boolean;
    onMarkAllAsRead: () => void;
    unreadOnly: boolean;
    setUnreadOnly: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-end gap-x2">

            <div className="flex items-center justify-between gap-2 pt-2 pr-2">
                <button
                    onClick={onMarkAllAsRead}
                    disabled={!anyUnread}
                    className={`text-[14px] leading-[16px] font-medium transition-colors text-primary
                        ${anyUnread
                            ? "!text-[var(--color-primary-500)] hover:underline cursor-pointer"
                            : "!text-gray-500 opacity-50 cursor-not-allowed"
                        }`
                    }
                >
                    Mark all as read
                </button>
                <div className="flex items-center gap-2">
                    <span
                        className="text-body-small cursor-pointer hover:underline"
                        onClick={() => setUnreadOnly(!unreadOnly)}
                    >
                        Only show unread
                    </span>

                    <Button
                        onClick={() => setUnreadOnly(!unreadOnly)}
                        variant="basic"
                        className={`w-12 h-6 rounded-full cursor-pointer p-1 hidden sm:flex items-center transition-colors border bg-primary ${unreadOnly ? "bg-primary" : "bg-gray-200"
                            }`}
                        aria-pressed={unreadOnly}
                        aria-label="Toggle only show unread"
                    >
                        <span
                            className={`w-4 h-4 bg-white rounded-full transition-transform mr-6  ${unreadOnly ? "translate-x-6" : "translate-x-0"
                                }`}
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
}