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
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer dark:!bg-gray-800  ">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex  items-center justify-center text-white text-body-tiny font-medium"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 " >
        <div className="flex items-center justify-between mb-1 ">
          <p className="text-body-small text-black dark:!text-white">
            <span className="font-medium mr-1 dark:!text-white">{name}</span> {action}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-body-tiny text-gray-500 dark:!text-white">{time}</span>

            {/* Unread Dot */}
            {showDot && (
              <button
                onClick={onMarkAsRead}
                className="relative w-3 h-3 flex items-center justify-center group cursor-pointer"
                aria-label="Mark notification as read"
                title="Mark as read"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#795CF5] block" />
                <span className="absolute -inset-[1px] rounded-full border-1 border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-6 -left-[100%] -translate-x-1/2 whitespace-nowrap border border-gray-300 bg-white text-black text-body-tiny px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ">
                  Mark as read
                </span>
              </button>
            )}
          </div>
        </div>

        <h4 className="text-body-small font-medium text-black mb-2 mt-2 dark:!text-white">
          {title}
        </h4>
        <p className="text-body-tiny text-gray-500 mb-1 dark:!text-white">{description}</p>
        <p className="text-body-tiny font-bold text-gray-500 dark:!text-white">{updates}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
