import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';

export type UserPayload = {
  userId: string;
  userName: string;
  userEmail: string;
  // userImage: string;
};

export interface RequestWithUser extends Request {
  user: UserPayload;
}
// export type RequestWithUser = { user: UserPayload };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  async validate(payload: UserPayload) {

    // console.log("Payload reçu:", payload); // Vérifier que le payload contient bien userId
    return payload;
  }
}
