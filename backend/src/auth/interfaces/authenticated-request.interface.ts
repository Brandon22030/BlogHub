import { Request } from 'express';
import { User } from '@prisma/client'; // Ou le chemin vers votre type User si différent

import { UserPayload } from '../jwt.strategy'; // Ajustez le chemin si nécessaire

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
