import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

export class SearchQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  sortBy?: string; // Par exemple: 'createdAt', 'views', 'title'

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc']) // Valider que sortOrder est 'asc' ou 'desc'
  sortOrder?: 'asc' | 'desc';
}
