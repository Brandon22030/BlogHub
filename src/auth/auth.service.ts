import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthBody } from './auth.controller';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ authBody }: { authBody: AuthBody }) {
    const { email, password } = authBody;

    const existingUser = this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("L'utilisateur n'existe pas.");
    }

    const isPasswordValid = await this.isPasswordValid({
      password,
      hashedPassword: (await existingUser).password,
    });

    if (!isPasswordValid) {
      throw new Error('Le mot de passe est invalide.');
    }

    return this.authenticateUser({
      userId: (await existingUser).id,
    });
  }

  // Register
  async register({ registerBody }: { registerBody: CreateUserDto }) {
    const { email, name, password } = registerBody;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error('Un compte existe déjà à cet email');
    }

    const hashedPassword = await this.hashedPassword({ password });

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return this.authenticateUser({
      userId: createdUser.id,
    });
  }

  private async hashedPassword({ password }: { password: string }) {
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

  private async authenticateUser({ userId }: UserPayload) {
    const payload: UserPayload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
