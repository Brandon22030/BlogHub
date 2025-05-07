import {
  ApiTags, // Ajouté
  ApiOperation, // Ajouté
  ApiResponse, // Ajouté
  ApiBody, // Ajouté
  ApiBearerAuth, // Ajouté
  ApiQuery, // Ajouté
} from '@nestjs/swagger'; // Ajouté
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
import { LoginSuccessResponseDto } from './dto/login-success-response.dto'; // AJOUTÉ
import { UserProfileResponseDto } from './dto/user-profile-response.dto'; // AJOUTÉ
import { RegisterSuccessResponseDto } from './dto/register-success-response.dto'; // AJOUTÉ
// Placeholder pour le type de retour de l'utilisateur, ajustez si nécessaire
// import { UserEntity } from '../user/entities/user.entity';

@ApiTags('Authentication') // Ajouté
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
  @ApiOperation({ summary: 'Log in an existing user' }) // Ajouté
  @ApiBody({ type: LogUserDto }) // Ajouté
  @ApiResponse({
    status: 200,
    description:
      'Login successful, access token in cookie, user info returned.',
    type: LoginSuccessResponseDto,
  }) // MODIFIÉ
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  }) // Ajouté
  @Post('login')
  async login(
    @Body() authBody: LogUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginSuccessResponseDto> {
    // Type de retour explicite
    const result = await this.authService.login({ authBody });
    // result est maintenant { access_token, message, userId, userName, userEmail, role }

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    // MODIFIÉ ICI: Construire l'objet LoginSuccessResponseDto
    return {
      message: result.message,
      userId: result.userId,
      userName: result.userName,
      userEmail: result.userEmail,
      role: result.role,
    };
  }

  /**
   * Logout the user by clearing the JWT cookie.
   */
  @ApiOperation({ summary: 'Log out the current user' }) // Ajouté
  @ApiResponse({ status: 200, description: 'Logout successful' }) // Ajouté
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
  @ApiOperation({ summary: 'Register a new user' }) // Ajouté
  @ApiBody({ type: CreateUserDto }) // Ajouté
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully. Please check email for verification.',
    type: RegisterSuccessResponseDto,
  }) // MODIFIÉ
  @ApiResponse({
    status: 400,
    description: 'Bad Request - e.g., validation error, email already exists',
  }) // Ajouté
  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    return await this.authService.register({ registerBody });
  }

  /**
   * Get the authenticated user's profile from the JWT token.
   * @param req - The request object containing user info
   * @returns The user's profile from JWT
   */
  @ApiOperation({ summary: 'Get current authenticated user profile' }) // Ajouté
  @ApiBearerAuth() // Ajouté
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileResponseDto,
  }) // MODIFIÉ
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token missing or invalid',
  }) // Ajouté
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
  @ApiOperation({ summary: 'Verify user email with token' }) // Ajouté
  @ApiQuery({
    name: 'token',
    description: 'Email verification token sent to user',
    type: String,
    required: true,
  }) // Ajouté
  @ApiResponse({ status: 200, description: 'Email verified successfully' }) // Ajouté
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid or expired token',
  }) // Ajouté
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
