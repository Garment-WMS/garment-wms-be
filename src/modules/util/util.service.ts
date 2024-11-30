import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UtilService {
  constructor(private readonly prismaService: PrismaService) {}
  regenerateCode(tableWithCode: Prisma.ModelName) {}
}
