import { Notification } from "../../types/notification";
import { api } from "./api";

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get("/notifications");
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post("/notifications/read-all");
  },
};
