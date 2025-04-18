// articles.controller.ts
import {
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
  Query,
  Controller,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArticlesService } from './articles.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/jwt.strategy';
import { CreateArticleDto } from './dto/create-article.dto';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Upload an image file for an article. Only allows JPEG, PNG, and GIF formats.
   * Requires JWT authentication.
   * @param file - The uploaded image file
   * @returns The file path of the uploaded image
   */
  @Post('/images/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return { secure_url: result.secure_url };
  }

  /**
   * Create a new article for the authenticated user.
   * Requires JWT authentication.
   * @param createArticleDto - Article creation payload
   * @param req - The request object containing user info
   * @returns The created article object
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    const article = await this.articlesService.create(
      createArticleDto,
      req.user.userId,
    );
    return article;
  }

  /**
   * Get all articles, with optional pagination and search.
   * @param query - Search and pagination parameters
   * @returns Array of articles
   */
  @Get()
  async findAll(@Query() query: SearchQueryDto) {
    return await this.articlesService.findAll(query);
  }

  /**
   * Get a specific article by its ID.
   * @param id - The article's unique ID
   * @returns The requested article object
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.articlesService.findOne(id);
  }

  /**
   * Update an article by its ID for the authenticated user.
   * Requires JWT authentication.
   * @param id - The article's unique ID
   * @param updateArticleDto - The update payload
   * @param req - The request object containing user info
   * @returns The updated article object
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: CreateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.articlesService.update(
      id,
      updateArticleDto,
      req.user.userId,
    );
  }
}
