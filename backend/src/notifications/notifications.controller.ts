import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@User('id') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Post(':id/read')
  markAsRead(@Param('id') notificationId: string, @User('id') userId: string) {
    return this.notificationsService.markAsRead(notificationId, userId);
  }

  @Post('read-all')
  markAllAsRead(@User('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}
