import { Inject, forwardRef, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Create a new notification in the database and send it in real-time.
   * @param createNotificationDto - Notification creation payload
   * @returns The created notification object
   */
  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      // Create notification in database
      const notification = await this.prisma.notification.create({
        data: {
          userId: createNotificationDto.userId,
          title: createNotificationDto.title,
          message: createNotificationDto.message,
          type: createNotificationDto.type,
          link: createNotificationDto.link,
          sourceId: createNotificationDto.sourceId,
        },
      });

      // Send real-time notification
      this.notificationsGateway.server
        .to(createNotificationDto.userId)
        .emit('notification', notification);

      return notification;
    } catch (error) {
      this.logger.error('Error creating notification', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Retrieve all notifications for a specific user.
   * @param userId - The user's unique ID
   * @returns Array of notifications
   */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      return await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('Error fetching user notifications', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  /**
   * Mark a specific notification as read for a user.
   * @param notificationId - The notification's unique ID
   * @param userId - The user's unique ID
   * @returns The updated notification object or error if not found/unauthorized
   */
  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification | null> {
    try {
      // Check that the notification belongs to the user
      const notif = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });
      if (!notif || notif.userId !== userId) {
        throw new Error('Notification not found or unauthorized');
      }
      return await this.prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } catch (error) {
      this.logger.error('Error marking notification as read', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read for a specific user.
   * @param userId - The user's unique ID
   * @returns The number of notifications marked as read
   */
  async markAllAsRead(userId: string): Promise<{ count: number }> {
    try {
      return await this.prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });
    } catch (error) {
      this.logger.error('Error marking all notifications as read', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }
}
