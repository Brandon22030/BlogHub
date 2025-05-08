import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

export type UserPayload = {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  userImage?: string; // Added for profile image persistence
};

export interface RequestWithUser extends Request { // Assurez-vous que Request est importé ou défini globalement
  user: UserPayload;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) { // Inject ConfigService
    const secret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    if (!secret) {
      throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined in environment variables. Application cannot start.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => { // Added 'any' type for req to address lint errors temporarily
          const token = req?.cookies?.access_token;
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      // Utilisez ConfigService pour obtenir le secret
      secretOrKey: secret,
    });
  }

  async validate(payload: UserPayload): Promise<UserPayload> { // Type de retour explicite
    // Le payload ici est le JWT décodé après vérification de la signature et de l'expiration
    // Vous pouvez ajouter une logique ici pour, par exemple, charger l'entité utilisateur depuis la base de données
    // si vous avez besoin de plus d'informations utilisateur ou pour vérifier si l'utilisateur existe toujours / n'est pas banni.
    // Pour l'instant, nous retournons simplement le payload tel quel.
    if (!payload || !payload.userId) {
      // Gérer le cas où le payload est invalide si nécessaire, bien que Passport-JWT devrait déjà gérer les tokens invalides.
    }
    return payload; // Passport va attacher ceci à req.user
  }
}
