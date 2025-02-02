import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() authBody: LogUserDto, @Res() res: Response) {
    const { acces_token } = await this.authService.login({ authBody });

    res.cookie('auth_token', access_token, {
      httpOnly: true, // Empêche l'accès par JavaScript (protège contre XSS)
      secure: process.env.NODE_ENV === 'production', // Active uniquement en HTTPS en production
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // Expiration : 30 jours
    });

    return res.json({ message: 'Connexion réussie' });
  }

  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    return await this.authService.register({ registerBody });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async authenticatedUser(@Req() req: RequestWithUser) {
    return await this.userService.getUser({
      userId: req.user.userId,
    });
  }
}
