import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assurez-vous que le chemin est correct

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: string, articleId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (existingFavorite) {
      // Ou vous pouvez choisir de ne rien faire ou de retourner le favori existant
      throw new ForbiddenException('Article already favorited');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        articleId,
      },
    });
  }

  async removeFavorite(userId: string, articleId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return this.prisma.favorite.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }

  async getFavoriteArticles(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        article: { // Inclure les détails de l'article
          include: {
            author: { // Optionnel : inclure l'auteur de l'article
              select: {
                id: true,
                name: true,
                imageUrl: true,
              }
            }, 
            category: { // Optionnel : inclure la catégorie de l'article
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc', // Afficher les plus récents en premier
      }
    });
  }

  async isArticleFavorited(userId: string, articleId: string): Promise<{ isFavorited: boolean }> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    return { isFavorited: !!favorite };
  }
}
