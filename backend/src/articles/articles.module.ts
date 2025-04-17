import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [PrismaModule],
  providers: [ArticlesService, CloudinaryService, CloudinaryProvider],

  controllers: [ArticlesController],
})
export class ArticlesModule {}
