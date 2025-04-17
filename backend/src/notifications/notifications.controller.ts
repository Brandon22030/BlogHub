import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Get all notifications for the authenticated user.
   * Requires JWT authentication.
   * @param userId - The user's unique ID
   * @returns Array of notifications
   */
  @Get()
  findAll(@User('id') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  /**
   * Mark a specific notification as read for the authenticated user.
   * Requires JWT authentication.
   * @param notificationId - The notification's unique ID
   * @param userId - The user's unique ID
   * @returns Confirmation message or error
   */
  @Post(':id/read')
  markAsRead(@Param('id') notificationId: string, @User('id') userId: string) {
    return this.notificationsService.markAsRead(notificationId, userId);
  }

  /**
   * Mark all notifications as read for the authenticated user.
   * Requires JWT authentication.
   * @param userId - The user's unique ID
   * @returns Confirmation message or error
   */
  @Post('read-all')
  markAllAsRead(@User('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

}

