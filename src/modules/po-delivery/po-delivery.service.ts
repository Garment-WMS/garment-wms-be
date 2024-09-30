import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PoDeliveryService {
  constructor(private readonly pirsmaService: PrismaService) {}

  async createPoDelivery(CreatePoDelivery: Prisma.PoDeliveryCreateInput) {
    return this.pirsmaService.poDelivery.create({
      data: CreatePoDelivery,
    });
  }
}
