import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  async updateCategory(
    id: string,
    data: { name?: string; slug?: string; imageUrl?: string },
  ) {
    const updateData = { ...data };
    if ((!data.slug || data.slug.trim() === '') && data.name) {
      updateData.slug = this.slugify(data.name);
    }
    return this.prisma.category.update({ where: { id }, data: updateData });
  }
  async deleteCategory(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve all categories from the database.
   * @returns Array of category objects
   */
  async getAllCategories() {
    return this.prisma.category.findMany();
  }

  /**
   * Create a new category with slug generated from name.
   */
  async createCategory(data: { name: string; imageUrl: string }) {
    const slug = this.slugify(data.name);
    return this.prisma.category.create({
      data: { ...data, slug },
    });
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string) {
    return this.prisma.category.findUnique({ where: { slug } });
  }

  /**
   * Utility to slugify a string
   */
  private slugify(text: string): string {
    return text
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
