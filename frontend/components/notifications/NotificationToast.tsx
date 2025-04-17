interface NotificationToastProps {
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
}

/**
 * NotificationToast component for BlogHub.
 * Renders a toast notification with title, message, and close functionality.
 * @param {NotificationToastProps} props - The props for the toast (title, message, visible, onClose).
 * @returns JSX.Element - The notification toast popup
 */
export default function NotificationToast({
  title,
  message,
  visible,
  onClose,
}: NotificationToastProps) {
  return (
    <div
      className={`${
        visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={onClose}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}
