import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { ArticlesModule } from './articles/articles.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { PrismaService } from './prisma/prisma.service';

import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    UploadModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ArticlesModule,
    PrismaModule,

    CategoryModule,
    ArticlesModule,
    CommentsModule,
  ],
  providers: [PrismaService],
  controllers: [],
})
export class AppModule {}
