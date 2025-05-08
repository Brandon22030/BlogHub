import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ArticleStatus } from '@prisma/client'; // L'énumération que vous avez définie pour le statut

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status: ArticleStatus = ArticleStatus.DRAFT; // Définir DRAFT comme valeur par défaut
}
