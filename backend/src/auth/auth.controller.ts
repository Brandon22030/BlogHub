import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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

  /**
   * Authenticate a user and return an access token.
   * @param authBody - The login credentials (email, password)
   * @returns JWT token and user info if successful
   */
  @Post('login')
  async login(
    @Body() authBody: LogUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login({ authBody });
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    const { access_token, ...rest } = result;
    return rest;
  }

  /**
   * Logout the user by clearing the JWT cookie.
   */
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully.' };
  }

  /**
   * Register a new user in the system.
   * @param registerBody - The user registration payload
   * @returns Confirmation message or error
   */
  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    return await this.authService.register({ registerBody });
  }

  /**
   * Get the authenticated user's profile from the JWT token.
   * @param req - The request object containing user info
   * @returns The user's profile from JWT
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  /**
   * Verify a user's email address using the provided token.
   * @param token - The email verification token
   * @returns Confirmation message or error
   */
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

}

