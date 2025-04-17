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

  // LOGIN
  async login({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new BadRequestException("L'utilisateur n'existe pas !");
    }

    if (!existingUser.isVerified) {
      throw new BadRequestException(
        'Veuillez vérifier votre adresse email avant de vous connecter.',
      );
    }

    const isPasswordValid = await this.isPasswordValid({
      password,
      hashedPassword: existingUser.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestException('Le mot de passe est incorrect !');
    }

    return {
      ...this.authenticateUser({
        userId: existingUser.id,
        userName: existingUser.name,
        userEmail: existingUser.email,
      }),
      message: 'Connexion réussie.',
    };
  }

  // REGISTER
  async register({ registerBody }: { registerBody: CreateUserDto }) {
    const { email, name, password, confirmPassword } = registerBody;

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Un compte existe déjà à cette adresse email !',
      );
    }

    const hashedPassword = await this.hashPassword({ password });

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isVerified: false,
        // verificationToken: '', // à activer si tu veux stocker le token
      },
    });

    // Générer le token de vérification
    const verificationToken = this.jwtService.sign(
      { email: createdUser.email },
      { expiresIn: '24h' },
    );

    // Envoi de l'email de vérification
    await this.sendVerificationEmail(createdUser.email, verificationToken);

    return {
      message:
        'Inscription réussie. Vérifiez votre email pour activer votre compte.',
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

  private authenticateUser({ userId, userName, userEmail }: UserPayload) {
    const payload: UserPayload = { userId, userName, userEmail };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

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
        <h2 style="text-align: center; color: #FC4308;">Vérification de votre adresse e-mail</h2>
        <p style="font-size: 16px; color: #333;">
          Bonjour, <br><br>
          Merci de vous être inscrit sur notre plateforme. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail et activer votre compte :
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; font-size: 18px; color: white; background-color: #FC4308; text-decoration: none; border-radius: 8px;">
            Vérifier mon e-mail
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail. Ce lien expirera dans 24 heures.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} BlogHub. Tous droits réservés.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Vérification de votre adresse e-mail',
      html: emailHTML,
    });
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) throw new BadRequestException('Utilisateur non trouvé.');
      if (user.isVerified) return { message: 'Email déjà vérifié.' };

      await this.prisma.user.update({
        where: { email: user.email },
        data: { isVerified: true, verificationToken: token },
      });

      return { message: 'Email vérifié avec succès.' };
    } catch (error) {
      throw new BadRequestException('Lien invalide ou expiré.');
    }
  }
}
