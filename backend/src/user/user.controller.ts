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
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from './user.service';
import { Request } from 'express';
import { RequestWithUser } from '../auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { UpdateProfileDto } from '../auth/dto/UpdateProfileDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users in the system.
   * @returns An array of user objects (id, name, email, imageUrl)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  /**
   * Get a user by their unique ID.
   * @param userId - The ID of the user to retrieve
   * @returns The user object (id, name, email, imageUrl)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/id/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser({ userId });
  }

  /**
   * Get the profile of the currently authenticated user.
   * Requires JWT authentication.
   * @param req - The request object containing user info
   * @returns The user's profile (id, name, email)
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    // Add role and ensure imageUrl is always present
    // Fetch the user from the database to get the latest imageUrl
    return this.userService
      .getUser({ userId: req.user.userId })
      .then((users) => {
        const dbUser = users && users[0];
        return {
          id: req.user.userId,
          name: req.user.userName,
          email: req.user.userEmail,
          imageUrl: dbUser?.imageUrl || undefined,
          role: req.user.role,
        };
      });
  }

  /**
   * Update the profile of the currently authenticated user.
   * Handles image upload and password verification.
   * @param req - The request object containing user info
   * @param body - The update payload (userName, email, password, oldPassword)
   * @param image - (Optional) profile image file
   * @returns The updated user object and a new JWT token
   */
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const userId = req.user.userId;
    return this.userService.updateProfile(userId, body, image);
  }

  /**
   * Delete a user by their unique ID (Admin only).
   * @param userId - The ID of the user to delete
   * @returns Success message
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  /**
   * Change a user's role (Admin only).
   * @param userId - The ID of the user
   * @param body - The new role { role: "USER" | "ADMIN" }
   * @returns The updated user object
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async changeUserRole(
    @Param('id') userId: string,
    @Body() body: { role: 'USER' | 'ADMIN' },
  ) {
    if (!body.role || (body.role !== 'USER' && body.role !== 'ADMIN')) {
      return { message: 'Invalid role. Must be USER or ADMIN.' };
    }
    return this.userService.changeUserRole(userId, body.role);
  }
}
