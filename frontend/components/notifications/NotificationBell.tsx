import { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationList from "./NotificationList";

/**
 * NotificationBell component for BlogHub.
 * Renders a notification bell icon with unread count and toggles the notification list.
 * @returns JSX.Element - The notification bell and dropdown
 */
export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <NotificationList onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
