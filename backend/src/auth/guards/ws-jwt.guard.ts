import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { Socket } from 'socket.io';
type Socket = any;

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();

    try {
      const token = client.handshake.auth.token;

      if (!token) {
        this.logger.warn('No token provided in WebSocket connection');
        return false;
      }

      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Attach the decoded user to the socket
      client.data.user = decoded;
      return true;
    } catch (error) {
      this.logger.error('WebSocket authentication failed', error);
      return false;
    }
  }
}
