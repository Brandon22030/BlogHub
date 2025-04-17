import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Get all categories available in the system.
   * @returns Array of category objects
   */
  @Get()
  async getCategories() {
    return this.categoryService.getAllCategories();
  }

}
