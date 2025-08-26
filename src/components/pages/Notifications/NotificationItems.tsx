// components/layout/Notifications/NotificationItems.tsx
type NotificationItemProps = {
  initials: string;
  color: string;
  name: string;
  action: string;
  time: string;
  showDot: boolean;
  title: string;
  description: string;
  updates: string;
  onMarkAsRead?: () => void;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  initials,
  color,
  name,
  action,
  time,
  showDot,
  title,
  description,
  updates,
  onMarkAsRead,
}) => {
  return (
    <div className="flex items-start gap-6 p-6 hover:bg-gray-50 transition-colors">
      {/* Avatar */}
      <div
        className="w-6 h-6 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-xs sm:text-lg font-medium"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs sm:text-base text-black">
            <span className="font-medium">{name}</span> {action}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-base text-gray-500">{time}</span>

            {/* Unread Dot */}
            {showDot && (
              <button
                onClick={onMarkAsRead}
                className="relative w-4 h-4 flex items-center justify-center group"
                aria-label="Mark notification as read"
                title="Mark as read"
              >
                <span className="w-2 h-2 rounded-full bg-[#795CF5] block" />
                <span className="absolute inset-0 rounded-full border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-8 -left-[100%] -translate-x-1/2 whitespace-nowrap border border-gray-300 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Mark as read
                </span>
              </button>
            )}
          </div>
        </div>

        <h4 className="text-xs sm:text-base font-medium text-black mb-1">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-gray-500 mb-2">{description}</p>
        <p className="text-xs sm:text-sm font-bold text-gray-500">{updates}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
