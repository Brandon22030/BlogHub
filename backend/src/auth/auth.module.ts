import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '30d' },
    }),
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, UserService],

  exports: [JwtModule],
})
export class AuthModule {}
