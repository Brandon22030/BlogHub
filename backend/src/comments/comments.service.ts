import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/dto/create-notification.dto';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentsService {
  /**
   * Initializes the CommentsService with dependencies.
   * @param prisma - PrismaService instance for database operations
   * @param notificationsService - NotificationsService instance for sending notifications
   */
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Create a new comment for an article. Handles both top-level comments and replies.
   * Sends notifications to article author or parent comment author as appropriate.
   * @param createCommentDto - Comment creation payload
   * @param userId - The ID of the user creating the comment
   * @returns The created comment object
   */
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

      // Notify article author if it's a top-level comment
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
        // Notify parent comment author if this is a reply
        const parentComment = await this.prisma.comment.findUnique({
          where: { id: createCommentDto.parentId },
        });

        if (parentComment && parentComment.authorId !== userId) {
          await this.notificationsService.create({
            userId: parentComment.authorId,
            recipientId: parentComment.authorId,
            type: NotificationType.REPLY,
            title: 'New Reply',
            message: `Someone replied to your comment`,
            link: `/articles/${article.id}#comment-${comment.id}`,
            sourceId: comment.id,
          });
        }
      }

      return comment;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error creating comment';
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
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
          commentLikes: {
            select: {
              userId: true,
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
              commentLikes: {
                select: {
                  userId: true,
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
                  commentLikes: {
                    select: {
                      userId: true,
                    },
                  },
                },
              },
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

      // Check if the comment was created within the last 15 minutes
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      if (comment.createdAt < fifteenMinutesAgo) {
        throw new HttpException(
          'Comments can only be edited within 15 minutes of posting',
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

  /**
   * Allows a user to like a comment.
   * @param commentId The ID of the comment to like.
   * @param userId The ID of the user liking the comment.
   * @returns The updated comment with the new like count.
   */
  async likeComment(commentId: string, userId: string): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      const existingLike = await this.prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      if (existingLike) {
        // User has already liked this comment, return current comment state
        return comment;
      }

      // Use a transaction to ensure atomicity
      const updatedComment = await this.prisma.$transaction(async (tx) => {
        await tx.commentLike.create({
          data: {
            userId,
            commentId,
          },
        });

        const currentComment = await tx.comment.findUnique({
          where: { id: commentId },
          select: { likesCount: true },
        });

        if (!currentComment) {
          throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
        }

        return tx.comment.update({
          where: { id: commentId },
          data: {
            likesCount: currentComment.likesCount + 1,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
            replies: true,
            commentLikes: true,
          },
        });
      });

      // TODO: Optionally send a notification to the comment author

      return updatedComment;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error liking comment';
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  /**
   * Allows a user to unlike a comment.
   * @param commentId The ID of the comment to unlike.
   * @param userId The ID of the user unliking the comment.
   * @returns The updated comment with the new like count.
   */
  async unlikeComment(commentId: string, userId: string): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      const existingLike = await this.prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      if (!existingLike) {
        // User hasn't liked this comment, or already unliked it.
        return comment;
      }

      // Use a transaction to ensure atomicity
      const updatedComment = await this.prisma.$transaction(async (tx) => {
        await tx.commentLike.delete({
          where: {
            userId_commentId: {
              userId,
              commentId,
            },
          },
        });

        const currentComment = await tx.comment.findUnique({
          where: { id: commentId },
          select: { likesCount: true },
        });

        if (!currentComment) {
          // Should not happen if commentLike existed, but good for safety
          throw new HttpException(
            'Comment not found after deleting like',
            HttpStatus.NOT_FOUND,
          );
        }

        // Ensure likesCount doesn't go below 0
        const newLikesCount = Math.max(0, currentComment.likesCount - 1);

        return tx.comment.update({
          where: { id: commentId },
          data: {
            likesCount: newLikesCount,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
            replies: true,
            commentLikes: true,
          },
        });
      });

      return updatedComment;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error unliking comment';
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }
}
