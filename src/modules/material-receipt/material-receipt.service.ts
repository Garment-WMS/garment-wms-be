import { HttpStatus, Injectable } from '@nestjs/common';
import { MaterialReceiptStatus, Prisma, PrismaClient } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { InventoryStockService } from '../inventory-stock/inventory-stock.service';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { CreateMaterialReceiptDto } from './dto/create-material-receipt.dto';
import { UpdateMaterialReceiptDto } from './dto/update-material-receipt.dto';

@Injectable()
export class MaterialReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poDeliveryService: PoDeliveryService,
    private readonly inventoryStockService: InventoryStockService,
  ) {}

  includeQuery: Prisma.MaterialReceiptInclude = {
    materialPackage: {
      include: {
        inventoryStock: true,
        materialVariant: {
          include: {
            material: {
              include: {
                materialUom: true,
              },
            },
          },
        },
      },
    },
  };

  async getAllMaterialReceiptOfMaterialPackage(
    materialPackageId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const materialReceipts = await prismaInstance.materialReceipt.findMany({
      where: {
        materialPackageId,
        status: {
          in: [
            MaterialReceiptStatus.AVAILABLE,
            MaterialReceiptStatus.PARTIAL_USED,
          ],
        },
      },
      include: this.includeQuery,
    });

    return materialReceipts;
  }

  findAllMaterialVariant() {
    throw new Error('Method not implemented.');
  }

  updateMaterialReceiptStatus(
    id: string,
    status: MaterialReceiptStatus,
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    return prismaInstance.materialReceipt.update({
      where: {
        id,
      },
      data: {
        importDate: new Date(),
        status,
      },
    });
  }

  async createMaterialReceipts(
    id: string,
    inspectionReportDetail: {
      id: string;
      materialPackageId: string | null;
      productSizeId: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      deletedAt: Date | null;
      approvedQuantityByPack: number;
      defectQuantityByPack: number;
      inspectionReportId: string;
      quantityByPack: number | null;
    }[],
    poDeliveryId: string,
    prismaInstance: PrismaClient = this.prismaService,
    // materialReceipts: CreateMaterialReceiptDto[],
  ) {
    let createdMaterialReceipts;
    for (let i = 0; i < inspectionReportDetail.length; i++) {
      const expiredDate = (await this.poDeliveryService.getExpiredDate(
        poDeliveryId,
        inspectionReportDetail[0].materialPackageId,
        prismaInstance,
      )) as unknown;
      const expireDate = expiredDate instanceof Date ? expiredDate : null;
      const resutl = await prismaInstance.materialReceipt.create({
        data: {
          importReceiptId: id,
          materialPackageId: inspectionReportDetail[i].materialPackageId,
          remainQuantityByPack: inspectionReportDetail[i].quantityByPack,
          quantityByPack: inspectionReportDetail[i].approvedQuantityByPack,
          expireDate: expireDate,
        },
      });
      createdMaterialReceipts.push(resutl);
    }

    return createdMaterialReceipts;
  }

  async updateMaterialReceiptQuantity(
    id: string,
    quantityByPack: number,
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    const materialReceipt = await this.findById(id);
    if (!materialReceipt) {
      throw new Error('Material Receipt not found');
    }
    return prismaInstance.$transaction(
      async (prismaInstance: PrismaService) => {
        await prismaInstance.materialReceipt.update({
          where: {
            id,
          },
          data: {
            remainQuantityByPack: quantityByPack,
          },
        });

        const remainQuantityByPack = await this.getRemainQuantityByPack(
          materialReceipt.materialPackageId,
          prismaInstance,
        );

        await this.inventoryStockService.updateMaterialStockQuantity(
          materialReceipt.materialPackageId,
          remainQuantityByPack,
          prismaInstance,
        );
        return null;
      },
    );
  }

  create(createMaterialReceiptDto: CreateMaterialReceiptDto) {
    return 'This action adds a new materialReceipt';
  }

  async findAll() {
    const materialReceipts = await this.prismaService.materialReceipt.findMany({
      include: this.includeQuery,
    });

    return apiSuccess(
      HttpStatus.OK,
      materialReceipts,
      'Get all material receipt successfully',
    );
  }

  //Will have to get all export material receipt and inventory report to calculate onHand
  // async findAllMaterialStock() {
  //   const allMaterial = await this.materialService.findAllWithoutResponse();

  //   allMaterial.forEach((material: any) => {
  //     material.numberOfMaterialVariant = material.materialVariant.length;

  //     if (material.numberOfMaterialVariant > 0) {
  //       material.onHand = material.materialVariant.reduce(
  //         (totalAcc, materialVariantEl) => {
  //           const variantTotal = materialVariantEl.materialReceipt.reduce(
  //             (acc, el) => {
  //               if (el.quantityByPack !== undefined) {
  //                 return acc + el.quantityByPack;
  //               }
  //               return acc;
  //             },
  //             0,
  //           );
  //           return totalAcc + variantTotal;
  //         },
  //         0,
  //       );
  //     } else {
  //       material.onHand = 0;
  //     }
  //   });

  //   return apiSuccess(
  //     HttpStatus.OK,
  //     allMaterial,
  //     'Get all material receipt successfully',
  //   );
  // }

  findById(id: string) {
    if (!isUUID(id)) {
      throw new Error('Invalid id');
    }
    return this.prismaService.materialReceipt.findUnique({
      where: {
        id,
      },
      include: this.includeQuery,
    });
  }

  async findOne(id: string) {
    const result = await this.findById(id);
    if (!result) {
      throw new Error('Material Receipt not found');
    }
    return apiSuccess(HttpStatus.OK, result, 'Material Receipt found');
  }

  async getRemainQuantityByPack(
    materialPackageId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const materialReceipts = await this.getAllMaterialReceiptOfMaterialPackage(
      materialPackageId,
      prismaInstance,
    );

    return materialReceipts.reduce((acc, el) => {
      return acc + el.remainQuantityByPack;
    }, 0);
  }

  update(id: number, updateMaterialReceiptDto: UpdateMaterialReceiptDto) {
    return `This action updates a #${id} materialReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialReceipt`;
  }
}
