import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

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

  /**
   * Get a category by its slug
   */
  @Get('slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }

  /**
   * Create a category (slug auto)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createCategory(@Body() body: { name: string; imageUrl: string }) {
    return this.categoryService.createCategory(body);
  }

  /**
   * Update a category (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; slug?: string; imageUrl?: string }
  ) {
    return this.categoryService.updateCategory(id, body);
  }

  /**
   * Delete a category (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
