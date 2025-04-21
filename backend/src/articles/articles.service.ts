import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleStatus } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SearchQueryDto } from './dto/search-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  // Return array of article IDs liked by the user
  async getLikedArticleIds(userId: string): Promise<string[]> {
    const likes = await this.prisma.like.findMany({
      where: { userId },
      select: { articleId: true },
    });
    return likes.map(like => like.articleId);
  }
  async incrementView(id: string) {
    return this.prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async incrementLike(id: string, userId: string) {
    // Check if Like already exists
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: id,
        },
      },
    });
    if (existingLike) {
      throw new HttpException(
        'You have already liked this article.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Create Like record
    await this.prisma.like.create({
      data: {
        userId,
        articleId: id,
      },
    });
    // Increment article like count
    return this.prisma.article.update({
      where: { id },
      data: { likes: { increment: 1 } },
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
    } catch {
      throw new HttpException(
        "Error creating article",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all articles with pagination and optional search/filtering.
   * @param query - Search and pagination parameters
   * @returns Paginated and filtered list of articles with meta info
   */
  async findAll(query: SearchQueryDto) {
    // Correction : accepte aussi le paramètre 'search' (venant du frontend)
    // et fallback sur 'searchTerm' si besoin
    const {
      page = 1,
      limit = 10,
      search: searchRaw,
      searchTerm: searchTermRaw,
      category,
      author,
    } = query;
    const searchTerm = searchRaw || searchTermRaw;
    const skip = (page - 1) * limit;

    try {
      // Build where clause for search (insensible, sur titre, contenu, auteur)
      const whereClause: Prisma.ArticleWhereInput = {
        status: ArticleStatus.PUBLISHED,
        ...(searchTerm && {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { author: { name: { contains: searchTerm, mode: 'insensitive' } } },
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
        orderBy: {
          createdAt: 'desc',
        },
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
    } catch {
      throw new HttpException(
        'Error retrieving articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Read a specific article by ID
  async findOne(id: string) {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id },
        include: {
          author: true,
          category: true,
        },
      });
      if (!article) {
        throw new HttpException('Article non trouvé', HttpStatus.NOT_FOUND);
      }
      return article;
    } catch {
      throw new HttpException(
        "Erreur lors de la récupération de l'article",
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
    } catch {
      throw new HttpException(
        "Erreur lors de la modification de l'article",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
