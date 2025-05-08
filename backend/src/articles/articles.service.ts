import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleStatus } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SearchQueryDto } from './dto/search-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  private viewCache: Map<string, Set<string>> = new Map();
  // Return array of article IDs liked by the user
  async getLikedArticleIds(userId: string): Promise<string[]> {
    const likes = await this.prisma.like.findMany({
      where: { userId },
      select: { articleId: true },
    });
    return likes.map((like) => like.articleId);
  }
  async incrementView(id: string, clientIp: string) {
    try {
      // Vérifier si l'article existe
      const article = await this.prisma.article.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              _count: { select: { articles: true } },
            },
          },
          category: true, // Assuming you might want category info too
        },
      });

      if (!article) {
        throw new HttpException('Article non trouvé', HttpStatus.NOT_FOUND);
      }

      // Créer une clé unique pour l'article
      const cacheKey = id;

      // Initialiser le Set pour cet article s'il n'existe pas et le récupérer
      if (!this.viewCache.has(cacheKey)) {
        this.viewCache.set(cacheKey, new Set<string>());
      }
      const viewSet = this.viewCache.get(cacheKey)!; // Using non-null assertion as we ensure it's set

      // Vérifier si cette IP a déjà vu l'article
      if (!viewSet.has(clientIp)) {
        // Ajouter l'IP au Set
        viewSet.add(clientIp);

        // Incrémenter le compteur de vues
        const updatedArticle = await this.prisma.article.update({
          where: { id },
          data: { views: { increment: 1 } },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                _count: { select: { articles: true } },
              },
            },
            category: true,
          },
        });

        // Nettoyer le cache après 24h
        setTimeout(
          () => {
            const currentViewSet = this.viewCache.get(cacheKey);
            if (currentViewSet) {
              currentViewSet.delete(clientIp);
              if (currentViewSet.size === 0) {
                this.viewCache.delete(cacheKey);
              }
            }
          },
          24 * 60 * 60 * 1000,
        );

        return updatedArticle;
      }

      // Si l'IP a déjà vu l'article, retourner l'article sans incrémenter
      return article;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      let errorMessage = "Erreur lors de l'incrémentation des vues";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('incrementView error:', error);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async setLikeStatus(id: string, userId: string, status: number) {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId: id } },
    });
    if (status === 1) {
      if (!existingLike) {
        await this.prisma.like.create({ data: { userId, articleId: id } });
        await this.prisma.article.update({
          where: { id },
          data: { likes: { increment: 1 } },
        });
      }
    } else if (status === 0) {
      if (existingLike) {
        await this.prisma.like.delete({
          where: { userId_articleId: { userId, articleId: id } },
        });
        await this.prisma.article.update({
          where: { id },
          data: { likes: { decrement: 1 } },
        });
      }
    }
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            _count: { select: { articles: true } },
          },
        },
        category: true,
      },
    });
  }
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new article in the database.
   * @param createArticleDto - The article creation payload
   * @param userId - The ID of the user creating the article
   * @returns The created article object
   */
  async create(createArticleDto: CreateArticleDto, userId: string) {
    try {
      const article = await this.prisma.article.create({
        data: {
          title: createArticleDto.title,
          content: createArticleDto.content,
          imageUrl: createArticleDto.imageUrl || null,
          status: createArticleDto.status || ArticleStatus.DRAFT,
          categoryId: createArticleDto.categoryId,
          authorId: userId,
        },
      });
      return article;
    } catch (error: unknown) {
      let detailedMessage = 'Error creating article';
      let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        detailedMessage = `Database error during article creation: Code ${error.code}`;
        console.error(detailedMessage, error.meta, error.message);
        // Vous pouvez mapper des codes d'erreur Prisma spécifiques à des HttpStatus si nécessaire
        // Par exemple, si error.code === 'P2002' (unique constraint failed)
        if (error.code === 'P2002') {
          httpStatus = HttpStatus.CONFLICT;
          detailedMessage = `Article creation failed due to a conflict: ${error.meta?.target}`;
        } else {
          httpStatus = HttpStatus.BAD_REQUEST;
        }
      } else if (error instanceof Error) {
        detailedMessage = error.message;
        console.error('Error creating article:', error);
      } else {
        console.error('Unknown error type during article creation:', error);
      }
      throw new HttpException(detailedMessage, httpStatus);
    }
  }

  /**
   * Get a single article by its ID, including author and category details.
   * Also includes the count of articles written by the author.
   * @param id - The ID of the article to retrieve
   * @returns The article object or throws NotFoundException
   */
  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            _count: { select: { articles: true } },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        // You might want to include comments here too later, or handle them separately
      },
    });
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  /**
   * Get all articles with pagination and optional search/filtering.
   * @param query - Search and pagination parameters
   * @returns Paginated and filtered list of articles with meta info
   */
  async findAll(query: SearchQueryDto) {
    // Correction: accepte aussi le paramètre 'search' (venant du frontend)
    // et fallback sur 'searchTerm' si besoin
    const {
      page = 1,
      limit = 10,
      search: searchRaw,
      searchTerm: searchTermRaw,
      category,
      author,
      sortBy, // <-- Utiliser sortBy de query
      sortOrder, // <-- Utiliser sortOrder de query
    } = query;
    const searchTerm = searchRaw || searchTermRaw;
    const skip = (page - 1) * limit;

    // Déterminer la clause orderBy dynamiquement
    let orderByClause: Prisma.ArticleOrderByWithRelationInput = {
      createdAt: 'desc', // Tri par défaut
    };

    if (sortBy && sortOrder) {
      // S'assurer que sortBy est un champ valide pour éviter les erreurs
      // Vous pourriez vouloir une liste de champs autorisés pour le tri
      const allowedSortByFields = ['createdAt', 'views', 'title', 'likes']; // Ajoutez d'autres champs si nécessaire
      if (allowedSortByFields.includes(sortBy)) {
        orderByClause = { [sortBy]: sortOrder };
      }
    }

    try {
      // Build where clause for search (insensible, sur titre, contenu, auteur)
      const whereClause: Prisma.ArticleWhereInput = {
        status: ArticleStatus.PUBLISHED,
        ...(searchTerm && {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            {
              author: {
                name: { contains: searchTerm, mode: 'insensitive' },
              },
            },
          ],
        }),
        ...(category && { categoryId: category }),
        ...(author && {
          author: { name: { contains: author, mode: 'insensitive' } },
        }),
      };

      // Get total count of matching articles
      const totalItems = await this.prisma.article.count({
        where: whereClause,
      });

      // Get paginated and filtered articles
      const articles = await this.prisma.article.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          content: true,
          imageUrl: true,
          author: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          categoryId: true,
          status: true,
          createdAt: true,
          views: true, // Ajout views
          likes: true, // Ajout likes
        },
        skip,
        take: limit,
        orderBy: orderByClause, // <-- UTILISER LA CLAUSE DYNAMIQUE
      });

      // Retourne les articles paginés + infos de pagination
      return {
        data: articles,
        meta: {
          totalItems,
          itemsPerPage: limit,
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          hasNextPage: page < Math.ceil(totalItems / limit),
          hasPreviousPage: page > 1,
        },
      };
    } catch (error: unknown) {
      let detailedMessage = 'Error retrieving articles';
      if (error instanceof Error) {
        detailedMessage = error.message;
        console.error('Error retrieving articles:', error);
      } else {
        console.error('Unknown error type during article retrieval:', error);
      }
      throw new HttpException(
        detailedMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update an article
  async update(id: string, updateArticleDto: CreateArticleDto, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new HttpException('Article non trouvé', HttpStatus.NOT_FOUND);
    }

    // Check if the user is the author
    if (article.authorId !== userId) {
      throw new HttpException(
        "Vous n'avez pas la permission de modifier cet article",
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      return await this.prisma.article.update({
        where: { id },
        data: {
          title: updateArticleDto.title,
          content: updateArticleDto.content,
          imageUrl: updateArticleDto.imageUrl || null,
          status: updateArticleDto.status || ArticleStatus.DRAFT,
          categoryId: updateArticleDto.categoryId,
        },
      });
    } catch (error: unknown) {
      let detailedMessage = "Erreur lors de la modification de l'article";
      let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        detailedMessage = `Database error during article update: Code ${error.code}`;
        console.error(detailedMessage, error.meta, error.message);
        if (error.code === 'P2025') {
          // Record to update not found
          httpStatus = HttpStatus.NOT_FOUND;
          detailedMessage = `Article with ID ${id} not found for update.`;
        } else {
          httpStatus = HttpStatus.BAD_REQUEST;
        }
      } else if (error instanceof Error) {
        detailedMessage = error.message;
        console.error('Error updating article:', error);
      } else {
        console.error('Unknown error type during article update:', error);
      }
      throw new HttpException(detailedMessage, httpStatus);
    }
  }
}
