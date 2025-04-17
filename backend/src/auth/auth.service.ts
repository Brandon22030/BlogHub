import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/login-user.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticate a user by email and password, and return a JWT token if valid.
   * Checks if the user exists and is verified, and validates the password.
   * @param authBody - Login credentials (email, password)
   * @returns JWT token and user info if successful
   */
  async login({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new BadRequestException("User does not exist!");
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

    return {
      ...this.authenticateUser({
        userId: existingUser.id,
        userName: existingUser.name,
        userEmail: existingUser.email,
      }),
      message: 'Login successful.',
    };
  }

  /**
   * Register a new user, hash their password, and send a verification email.
   * @param registerBody - Registration payload (name, email, password, confirmPassword)
   * @returns Confirmation message
   */
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
        // verificationToken: '', // enable if you want to store the token
      },
    });

    // Generate the verification token
    const verificationToken = this.jwtService.sign(
      { email: createdUser.email },
      { expiresIn: '24h' },
    );

    // Send the verification email
    await this.sendVerificationEmail(createdUser.email, verificationToken);

    return {
      message:
        'Registration successful. Check your email to activate your account.',
    };
  }

  /**
   * Hash a plain text password using bcrypt.
   * @param password - The plain text password
   * @returns The hashed password
   */
  private async hashPassword({ password }: { password: string }) {
    return await hash(password, 10);
  }

  /**
   * Compare a plain text password to a hashed password.
   * @param password - The plain text password
   * @param hashedPassword - The hashed password
   * @returns True if passwords match, false otherwise
   */
  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    return await compare(password, hashedPassword);
  }

  /**
   * Generate a JWT token for an authenticated user.
   * @param userId - The user's ID
   * @param userName - The user's name
   * @param userEmail - The user's email
   * @returns An object containing the JWT access token
   */
  private authenticateUser({ userId, userName, userEmail }: UserPayload) {
    const payload: UserPayload = { userId, userName, userEmail };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Send a verification email to a newly registered user.
   * @param email - The user's email address
   * @param token - The verification token
   */
  private async sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

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
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: emailHTML,
    });
  }

  /**
   * Verify a user's email address using the provided token.
   * @param token - The JWT verification token
   * @returns Confirmation message or error
   */
  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) throw new BadRequestException('User not found.');
      if (user.isVerified) return { message: 'Email already verified.' };

      await this.prisma.user.update({
        where: { email: user.email },
        data: { isVerified: true, verificationToken: token },
      });

      return { message: 'Email verified successfully.' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired link.');
    }
  }
}
