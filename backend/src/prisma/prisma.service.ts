import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Called when the module initializes. Establishes a connection to the database.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Called when the module is destroyed. Closes the database connection.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
