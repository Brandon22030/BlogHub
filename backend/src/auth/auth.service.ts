import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/login-user.dto';

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
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("L'utilisateur n'existe pas!!!");
    }

    const isPasswordValid = await this.isPasswordValid({
      password,
      hashedPassword: existingUser.password,
    });

    if (!isPasswordValid) {
      throw new Error('Le mot de passe est incorrect!!!');
    }

    return this.authenticateUser({
      userId: existingUser.id,
      userName: existingUser.name,
      userEmail: existingUser.email,
    });
  }

  // REGISTER;
  async register({ registerBody }: { registerBody: CreateUserDto }) {
    const { email, name, password, confirmPassword } = registerBody;

    // Vérification si les mots de passe correspondent
    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error('Un compte existe déjà à cet adresse email!!!');
    }

    const hashedPassword = await this.hashPassword({ password });

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return this.authenticateUser({
      userId: createdUser.id,
      userName: createdUser.name,
      userEmail: createdUser.email,
    });
  }

  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await hash(password, 10);

    return hashedPassword;
  }

  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPasswordValid = await compare(password, hashedPassword);

    return isPasswordValid;
  }

  private authenticateUser({ userId, userName, userEmail }: UserPayload) {
    const payload: UserPayload = { userId, userName, userEmail };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
