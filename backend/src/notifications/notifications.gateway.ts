import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger, UseGuards, Inject, forwardRef } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        this.logger.warn('No token provided in WebSocket connection');
        await client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = decoded;
      this.logger.log(
        `WebSocket connection established for user ${decoded.sub}`,
      );
    } catch (error) {
      this.logger.error('WebSocket connection error', error);
      await client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    if (client.data.user) {
      this.logger.log(
        `WebSocket disconnection for user ${client.data.user.sub}`,
      );
      delete client.data.user;
    }
  }

  @SubscribeMessage('createNotification')
  async handleCreateNotification(
    client: Socket,
    payload: CreateNotificationDto,
  ): Promise<void> {
    try {
      const notification = await this.notificationsService.create(payload);

      this.server.to(payload.recipientId).emit('notification', notification);
    } catch (error) {
      this.logger.error('Create notification error:', error);
      client.emit('error', { message: 'Failed to create notification' });
    }
  }

  async sendNotification(userId: string, notification: any): Promise<void> {
    try {
      await this.server.to(userId).emit('notification', notification);
    } catch (error) {
      this.logger.error('Error sending notification', error);
    }
  }
}
