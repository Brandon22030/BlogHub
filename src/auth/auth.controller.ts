import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';

export type AuthBody = { email: string; password: string };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServirce: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() authBody: AuthBody) {
    return await this.authServirce.login({
      authBody,
    });
  }

  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    return await this.authServirce.register({
      registerBody,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async authenticateUser(@Req() req: RequestWithUser) {
    return await this.userService.getUser({
      userId: req.user.userId,
    });
  }
}
