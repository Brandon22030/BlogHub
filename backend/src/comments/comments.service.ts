import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/dto/create-notification.dto';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    try {
      // Check if article exists
      const article = await this.prisma.article.findUnique({
        where: { id: createCommentDto.articleId },
      });

      if (!article) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }

      // If this is a reply, check if parent comment exists
      if (createCommentDto.parentId) {
        const parentComment = await this.prisma.comment.findUnique({
          where: { id: createCommentDto.parentId },
        });

        if (!parentComment) {
          throw new HttpException(
            'Parent comment not found',
            HttpStatus.NOT_FOUND,
          );
        }

        // Check if parent comment belongs to the same article
        if (parentComment.articleId !== createCommentDto.articleId) {
          throw new HttpException(
            'Parent comment does not belong to this article',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const comment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          authorId: userId,
          articleId: createCommentDto.articleId,
          parentId: createCommentDto.parentId || null,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });

      // Send notification to article author if it's a top-level comment
      if (!createCommentDto.parentId && article.authorId !== userId) {
        await this.notificationsService.create({
          userId: article.authorId,
          recipientId: article.authorId,
          type: NotificationType.COMMENT,
          title: 'New Comment',
          message: `Someone commented on your article`,
          link: `/articles/${article.id}#comment-${comment.id}`,
          sourceId: comment.id,
        });
      } else if (createCommentDto.parentId) {
        // Send notification to parent comment author for replies
        const parentComment = await this.prisma.comment.findUnique({
          where: { id: createCommentDto.parentId },
        });

        if (parentComment && parentComment.authorId !== userId) {
          await this.notificationsService.create({
            userId: parentComment.authorId,
            recipientId: parentComment.authorId,
            type: NotificationType.REPLY,
            title: 'New Reply',
            message: 'Someone replied to your comment',
            link: `/articles/${article.id}#comment-${comment.id}`,
            sourceId: comment.id,
          });
        }
      }

      return comment;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error creating comment:', error);
      throw new HttpException(
        'Error creating comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByArticleId(articleId: string) {
    try {
      return await this.prisma.comment.findMany({
        where: {
          articleId,
          parentId: null, // Only get top-level comments
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
              replies: true, // Include nested replies
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      throw new HttpException(
        'Error fetching comments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      if (comment.authorId !== userId) {
        throw new HttpException(
          'You do not have permission to update this comment',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.prisma.comment.update({
        where: { id },
        data: updateCommentDto,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error updating comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, userId: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      if (comment.authorId !== userId) {
        throw new HttpException(
          'You do not have permission to delete this comment',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.prisma.comment.delete({
        where: { id },
      });

      return { message: 'Comment deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error deleting comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
