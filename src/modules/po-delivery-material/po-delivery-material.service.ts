import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PoDeliveryMaterialService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPoDeliveryMaterial(
    createPoDeliveryMaterial: Prisma.PoDeliveryDetailCreateInput,
  ) {
    return this.prismaService.poDeliveryDetail.create({
      data: createPoDeliveryMaterial,
    });
  }
}
