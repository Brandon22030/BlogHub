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

  // Récupérer tout les utilisateurs
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  // Récupérer un utilisateur par son ID
  @Get('/id/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser({ userId });
  }

  // Récupérer le profil de l'utilisateur connecté
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
      // imageUrl: req.user.userImage
    };
  }

  // Mettre à jour le profil de l'utilisateur connecté
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
