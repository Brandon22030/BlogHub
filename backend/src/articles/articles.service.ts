import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
    constructor(private readonly  prisma: PrismaService){}

    async create()
}
