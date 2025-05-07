import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/jwt.strategy';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Create a new comment for the authenticated user.
   * Requires JWT authentication.
   * @param createCommentDto - Comment creation payload
   * @param req - The request object containing user info
   * @returns The created comment object
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.create(createCommentDto, req.user.userId);
  }

  /**
   * Get all comments for a specific article by its ID.
   * @param articleId - The article's unique ID
   * @returns Array of comments for the article
   */
  @Get('article/:articleId')
  findByArticleId(@Param('articleId') articleId: string) {
    return this.commentsService.findByArticleId(articleId);
  }

  /**
   * Update a comment by its ID for the authenticated user.
   * Requires JWT authentication.
   * @param id - The comment's unique ID
   * @param updateCommentDto - The update payload
   * @param req - The request object containing user info
   * @returns The updated comment object
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user.userId);
  }

  /**
   * Delete a comment by its ID for the authenticated user.
   * Requires JWT authentication.
   * @param id - The comment's unique ID
   * @param req - The request object containing user info
   * @returns Confirmation message or error
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.commentsService.remove(id, req.user.userId);
  }

  /**
   * Like a comment.
   * Requires JWT authentication.
   * @param id - The comment's unique ID (commentId)
   * @param req - The request object containing user info
   * @returns The updated comment object with like count
   */
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  likeComment(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.commentsService.likeComment(id, req.user.userId);
  }

  /**
   * Unlike a comment.
   * Requires JWT authentication.
   * @param id - The comment's unique ID (commentId)
   * @param req - The request object containing user info
   * @returns The updated comment object with like count
   */
  @Post(':id/unlike') // Alternatively, could use @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  unlikeComment(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.commentsService.unlikeComment(id, req.user.userId);
  }
}
