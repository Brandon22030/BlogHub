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
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { RequestWithUser } from 'src/auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users in the system.
   * @returns An array of user objects (id, name, email, imageUrl)
   */
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  /**
   * Get a user by their unique ID.
   * @param userId - The ID of the user to retrieve
   * @returns The user object (id, name, email, imageUrl)
   */
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

    return {
      id: req.user.userId,
      name: req.user.userName,
      email: req.user.userEmail,
      // imageUrl: req.user.userImage
    };
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
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() body,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const userId = req.user.userId;
    return this.userService.updateProfile(userId, body, image);
  }

}

