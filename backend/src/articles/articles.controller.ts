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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/jwt.strategy';
import { CreateArticleDto } from './dto/create-article.dto';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('/images/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Type de fichier non autorisé'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { filePath: `/uploads/${file.filename}` }; // Retourne le chemin d'accès
  }

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

  // Route pour obtenir tous les articles avec pagination et recherche
  @Get()
  async findAll(@Query() query: SearchQueryDto) {
    return await this.articlesService.findAll(query);
  }

  // Route pour récupérer un article spécifique par ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.articlesService.findOne(id);
  }

  // Route pour modifier un article
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
