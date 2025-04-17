import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve all categories from the database.
   * @returns Array of category objects
   */
  async getAllCategories() {
    return this.prisma.category.findMany();
  }

}
