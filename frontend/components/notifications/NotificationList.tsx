import { useRouter } from "next/router";
import { useNotifications } from "../../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "../../types/notification";

interface NotificationListProps {
  onClose: () => void;
}

/**
 * NotificationList component for BlogHub.
 * Displays a list of notifications, loading state, and handles navigation and marking as read.
 * @param {NotificationListProps} props - The props for the notification list (onClose callback).
 * @returns JSX.Element - The notifications dropdown list
 */
export default function NotificationList({ onClose }: NotificationListProps) {
  const router = useRouter();
  const { notifications, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">No notifications yet</div>
    );
  }

  return (
    <div className="max-h-[32rem] overflow-y-auto">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          Mark all as read
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`cursor-pointer p-4 transition hover:bg-gray-50 ${
              !notification.read ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {!notification.read && (
                <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
