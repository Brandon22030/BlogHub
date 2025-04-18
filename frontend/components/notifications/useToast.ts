import { useState, useCallback } from "react";

export interface ToastOptions {
  title: string;
  message: string;
  duration?: number; // ms
  type?: 'success' | 'error';
}

export function useToast() {
  const [toast, setToast] = useState<ToastOptions & { visible: boolean }>({
    title: "",
    message: "",
    visible: false,
    duration: 4000,
    type: 'success',
  });

  const showToast = useCallback((options: ToastOptions) => {
    setToast({ ...options, visible: true, duration: options.duration || 4000, type: options.type || 'success' });
    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, options.duration || 4000);
  }, []);

  const hideToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), []);

  return { toast, showToast, hideToast };
}
