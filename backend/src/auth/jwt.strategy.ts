import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';

export type UserPayload = {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  userImage?: string; // Added for profile image persistence
};

export interface RequestWithUser extends Request {
  user: UserPayload;
}
// export type RequestWithUser = { user: UserPayload };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          // console.log('Cookies reçus dans JwtStrategy:', req.cookies); // Peut être commenté si trop verbeux
          const token = req?.cookies?.access_token;
          // console.log('Token extrait du cookie access_token:', token); // Peut être commenté si trop verbeux
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
    // console.log('JwtStrategy initialized. Secret used (ou une partie pour vérification):', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 5) + '...' : 'Non défini !');
  }

  async validate(payload: UserPayload) {
    // console.log('JwtStrategy - Méthode VALIDATE appelée.');
    // console.log('JwtStrategy - Payload reçu dans validate:', payload);
    if (!payload || !payload.userId) {
      // console.error('JwtStrategy - VALIDATE: Payload invalide ou userId manquant !', payload);
      // Vous pourriez envisager de lancer une UnauthorizedException ici si le payload n'est pas conforme
      // import { UnauthorizedException } from '@nestjs/common';
      // throw new UnauthorizedException('Invalid token payload');
    }
    return payload; // Passport va attacher ceci à req.user
  }
}
