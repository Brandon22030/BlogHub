// auth.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/login-user.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new BadRequestException('User does not exist!');
    }

    if (!existingUser.isVerified) {
      throw new BadRequestException(
        'Please verify your email address before logging in.',
      );
    }

    const isPasswordValid = await this.isPasswordValid({
      password,
      hashedPassword: existingUser.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password!');
    }

    const tokenData = this.authenticateUser({
      userId: existingUser.id,
      userName: existingUser.name,
      userEmail: existingUser.email,
      role: existingUser.role,
    });

    return {
      access_token: tokenData.access_token,
      message: 'Login successful.',
      userId: existingUser.id,
      userName: existingUser.name,
      userEmail: existingUser.email,
      role: existingUser.role,
    };
  }

  async register({ registerBody }: { registerBody: CreateUserDto }) {
    const { email, name, password, confirmPassword } = registerBody;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'An account with this email already exists!',
      );
    }

    const hashedPassword = await this.hashPassword({ password });

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isVerified: false,
      },
    });

    const verificationToken = this.jwtService.sign(
      { email: createdUser.email },
      {
        expiresIn: '24h',
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      },
    );

    await this.sendVerificationEmail(createdUser.email, verificationToken);

    return {
      message:
        'Registration successful. Check your email to activate your account.',
    };
  }

  private async hashPassword({ password }: { password: string }) {
    return await hash(password, 10);
  }

  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    return await compare(password, hashedPassword);
  }

  private authenticateUser({ userId, userName, userEmail, role }: UserPayload) {
    const payload: UserPayload = { userId, userName, userEmail, role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
    };
  }

  private async sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #FC4308;">Verify your email address</h2>
        <p style="font-size: 16px; color: #333;">
          Hello, <br><br>
          Thank you for registering on our platform. Please click the button below to verify your email address and activate your account:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; font-size: 18px; color: white; background-color: #FC4308; text-decoration: none; border-radius: 8px;">
            Verify my email
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          If you did not request this, you can ignore this email. This link will expire in 24 hours.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} BlogHub. All rights reserved.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Verify your email address',
      html: emailHTML,
    });
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) throw new NotFoundException('User not found.');
      if (user.isVerified) return { message: 'Email already verified.' };

      await this.prisma.user.update({
        where: { email: user.email },
        data: { isVerified: true },
      });

      return { message: 'Email verified successfully.' };
    } catch (error) {
      console.error('Email verification error:', error);
      throw new BadRequestException('Invalid or expired link.');
    }
  }

  // Méthodes pour la réinitialisation du mot de passe

  private generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #FC4308;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #333;">
          Hello,<br><br>
          You requested a password reset for your BlogHub account. Please click the button below to choose a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; font-size: 18px; color: white; background-color: #FC4308; text-decoration: none; border-radius: 8px;">
            Reset My Password
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          If you did not request this, please ignore this email. This link is valid for 1 hour.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} BlogHub. All rights reserved.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'BlogHub Password Reset Request',
      html: emailHTML,
    });
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const { email } = requestPasswordResetDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`Password reset request for non-existent email: ${email}`);
      return {
        message:
          'If your email address exists in our system, you will receive a password reset link shortly.',
      };
    }
    if (!user.isVerified) {
      console.log(`Password reset attempt for unverified email: ${email}`);
      return {
        message:
          'Please verify your email address before attempting a password reset.',
      };
    }

    const token = this.generatePasswordResetToken();
    const hashedToken = await this.hashPassword({ password: token });
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    await this.prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
      },
    });

    try {
      await this.sendPasswordResetEmail(email, token);
      return {
        message:
          'If your email address exists in our system and is verified, you will receive a password reset link shortly.',
      };
    } catch (emailError) {
      console.error(
        `Failed to send password reset email to ${email}:`,
        emailError,
      );
      return {
        message:
          'An error occurred while processing your request. Please try again later.',
      };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword, confirmNewPassword } = resetPasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const hashedToken = await this.hashPassword({ password: token });

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const newHashedPassword = await this.hashPassword({
      password: newPassword,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: newHashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        isVerified: true,
      },
    });

    return { message: 'Password has been reset successfully.' };
  }
}
