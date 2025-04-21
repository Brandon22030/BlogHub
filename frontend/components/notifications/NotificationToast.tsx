interface NotificationToastProps {
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

/**
 * NotificationToast component for BlogHub.
 * Renders a toast notification with title, message, and close functionality.
 * @param {NotificationToastProps} props - The props for the toast (title, message, visible, onClose).
 * @returns JSX.Element - The notification toast popup
 */
import { useEffect, useState } from "react";

export default function NotificationToast({
  title,
  message,
  visible,
  onClose,
  type = "success",
}: NotificationToastProps) {
  const [shouldRender, setShouldRender] = useState(visible);
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [visible]);
  const color =
    type === "success"
      ? "bg-green-50 border-green-400 text-green-800"
      : "bg-red-50 border-red-400 text-red-800";
  const icon =
    type === "success" ? (
      <svg
        className="w-6 h-6 text-green-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg
        className="w-6 h-6 text-red-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  // Animation slide-in/out droite
  const animationClass = visible
    ? "animate-toast-slide-in"
    : "animate-toast-slide-out";
  if (!shouldRender) return null;
  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${animationClass} max-w-md w-full ${color} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4 flex items-start">
        <div className="flex-shrink-0 pt-1">{icon}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        {/* <button
          onClick={onClose}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2"
        >
          ×
        </button> */}
      </div>
    </div>
  );
}
