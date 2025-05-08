import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assurez-vous que le chemin est correct
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface'; // Assurez-vous que le chemin est correct

@Controller('favorites')
@UseGuards(JwtAuthGuard) // Protéger toutes les routes de ce contrôleur
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavoriteArticles(@Req() req: AuthenticatedRequest) {
    return this.favoritesService.getFavoriteArticles(req.user.userId);
  }

  @Get(':articleId/status')
  async isArticleFavorited(
    @Req() req: AuthenticatedRequest,
    @Param('articleId') articleId: string,
  ) {
    // console.log('User ID in controller:', req.user?.userId); // Log temporaire
    // console.log('Article ID in controller:', articleId); // Log temporaire
    if (!req.user?.userId) {
      // Vérification additionnelle
      throw new Error('User ID is missing in request');
    }
    return this.favoritesService.isArticleFavorited(req.user.userId, articleId);
  }

  @Post(':articleId')
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @Req() req: AuthenticatedRequest,
    @Param('articleId') articleId: string,
  ) {
    return this.favoritesService.addFavorite(req.user.userId, articleId);
  }

  @Delete(':articleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @Req() req: AuthenticatedRequest,
    @Param('articleId') articleId: string,
  ) {
    return this.favoritesService.removeFavorite(req.user.userId, articleId);
  }
}
