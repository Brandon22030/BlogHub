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

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification | null> {
    try {
      // Vérifie que la notif appartient à l'utilisateur
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
