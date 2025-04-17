import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { Notification } from '../types/notification';
import { initializeSocket, disconnectSocket } from '../lib/socket';
import { notificationsApi } from '../lib/api/notifications';
import { toast } from 'react-hot-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifications();
      const newSocket = initializeSocket(token);
      setSocket(newSocket);

      return () => {
        disconnectSocket();
      };
    }
  }, [fetchNotifications]);

  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (data) => {
      const newNotification = {
        ...data,
        id: Math.random().toString(), // Temporary ID until refresh
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      import('../components/notifications/NotificationToast').then(({ default: NotificationToast }) => {
        toast.custom((t) => NotificationToast({
          title: data.title,
          message: data.message,
          visible: t.visible,
          onClose: () => toast.dismiss(t.id),
        }));
      });
    });

    return () => {
      socket.off('notification');
    };
  }, [socket]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
