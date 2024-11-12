import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PoDeliveryMaterialService {
  // async createExtraPODelivery(purchaseOrderId: string, materialPackageId: string, quantityByPack: number) {
  //     const createPoDeliveryMaterial: Prisma.PoDeliveryDetailCreateInput={
  //       quantityByPack: quantityByPack,
  //       totalAmount: undefined,
  //       materialPackage: {
  //         connect: {id: materialPackageId}
  //       },
  //       poDelivery: {
  //         connectOrCreate: {
  //           where: {
  //             AND: [
  //               { purchaseOrderId },
  //               { isExtra: true },
  //               { status: PoDeliveryStatus.PENDING }
  //             ]
  //           },
  //           create: undefined
  //         },
  //       }
  //     }
  //   }
  constructor(private readonly prismaService: PrismaService) {}

  //Need to test this function
  async createPoDeliveryMaterial(
    createPoDeliveryMaterial: Prisma.PoDeliveryDetailCreateInput,
    poDeliveryId: string,
    materialPackageId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    return prismaInstance.poDeliveryDetail.upsert({
      where: {
        poDeliveryId_materialPackageId: {
          poDeliveryId: poDeliveryId,
          materialPackageId: materialPackageId,
        },
      },
      create: createPoDeliveryMaterial,
      update: {
        quantityByPack: {
          increment: createPoDeliveryMaterial.quantityByPack,
        },
      },
    });
  }
}
