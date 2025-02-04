import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { RequestWithUser } from 'src/auth/jwt.strategy';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('/id/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser({ userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new Error('Utilisateur non authentifié');
    }

    return {
      id: req.user.userId,
      name: req.user.userName,
      email: req.user.userEmail,
    };
  }
}
