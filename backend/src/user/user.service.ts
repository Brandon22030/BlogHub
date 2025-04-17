import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService, // injecte JwtService
  ) {}

  // Récupérer tout les utilisateurs
  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });
    return users;
  }

  // Récupérer un utilisateur par son ID
  async getUser({ userId }: { userId: string }) {
    const users = await this.prisma.user.findMany({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });
    return users;
  }

  // Mettre à jour un utilisateur par son ID
  async updateProfile(userId: string, body: any, image?: Express.Multer.File) {
    // 1. Récupère l'utilisateur
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('Utilisateur non trouvé.');

    // 2. Vérifie l'ancien mot de passe
    if (!body.oldPassword)
      throw new BadRequestException('Ancien mot de passe requis.');
    const passwordValid = await bcrypt.compare(body.oldPassword, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('Ancien mot de passe incorrect.');

    // 3. Prépare les données à mettre à jour
    const data: any = {};
    if (body.userName) data.name = body.userName;
    if (body.email) data.email = body.email;
    if (body.password) data.password = await bcrypt.hash(body.password, 10);

    // 4. Gère l'image si présente
    if (image && image.filename) {
      data.imageUrl = `/uploads/${image.filename}`;
    }

    // Mise à jour effective en base
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    // Génère un nouveau token avec les nouvelles infos
    const payload = {
      userId: updatedUser.id,
      userName: updatedUser.name,
      userEmail: updatedUser.email,
      userImage: updatedUser.imageUrl,
    };
    const newToken = this.jwtService.sign(payload);

    return {
      message: 'Profil mis à jour avec succès.',
      token: newToken,
      user: payload,
    };

  }
}
