import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UserController],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    UserService,
    PrismaService,
    CloudinaryService,
    CloudinaryProvider,
  ],
})
export class UserModule {}
