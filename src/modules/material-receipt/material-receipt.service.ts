import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {
  ImportRequest,
  MaterialReceiptStatus,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { isUUID } from 'class-validator';
import {
  materialReceiptIncludeWithoutImportReceipt,
  materialReceiptIncludeWithoutImportReceipt2,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { InventoryStockService } from '../inventory-stock/inventory-stock.service';
import { MaterialPackageService } from '../material-package/material-package.service';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { CreateMaterialReceiptDto } from './dto/create-material-receipt.dto';
import { UpdateMaterialReceiptDto } from './dto/update-material-receipt.dto';

@Injectable()
export class MaterialReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poDeliveryService: PoDeliveryService,
    private readonly inventoryStockService: InventoryStockService,
    private readonly materialPackagesService: MaterialPackageService,
  ) {}

  async findByCode(code: string) {
    const result = await this.prismaService.materialReceipt.findFirst({
      where: {
        code,
      },
      include: materialReceiptIncludeWithoutImportReceipt2,
    });
    return apiSuccess(
      result ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      result,
      result ? 'Material Receipt found' : 'Material Receipt not found',
    );
  }
  updateAwaitStatus() {
    throw new Error('Method not implemented.');
  }

  findByQuery(query: any) {
    return this.prismaService.materialReceipt.findFirst({
      where: query,
      include: materialReceiptIncludeWithoutImportReceipt,
    });
  }

  async recountMaterialInventoryStock() {
    const allMaterialPackage = await this.materialPackagesService.findAllRaw();

    for (let materialPackage of allMaterialPackage) {
      const remainQuantityByPack = await this.getRemainQuantityByPack(
        materialPackage.id,
      );
      await this.inventoryStockService.updateMaterialStockQuantity(
        materialPackage.id,
        remainQuantityByPack,
      );
    }
    return null;
  }

  async getAllMaterialReceiptOfMaterialPackage(
    materialPackageId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const materialReceipts = await prismaInstance.materialReceipt.findMany({
      where: {
        materialPackage: { id: materialPackageId },
        status: {
          in: [MaterialReceiptStatus.AVAILABLE],
        },
      },
      include: materialReceiptIncludeWithoutImportReceipt,
    });

    return materialReceipts;
  }

  async getAllMaterialReceiptOfMaterialVariant(
    materialVariantId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const materialReceipts = await prismaInstance.materialReceipt.findMany({
      where: {
        materialPackage: {
          materialVariantId: materialVariantId,
        },
        status: {
          in: [MaterialReceiptStatus.AVAILABLE],
        },
      },
      include: materialReceiptIncludeWithoutImportReceipt,
    });

    return materialReceipts;
  }

  async getAllMaterialReceiptOfMaterialVariantSimplified(
    materialVariantId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const materialVariant = await this.prismaService.materialVariant.count({
      where: {
        id: materialVariantId,
      },
    });
    if (materialVariant === 0) {
      throw new NotFoundException('Material Variant not found');
    }
    const materialReceipts = await prismaInstance.materialReceipt.findMany({
      where: {
        materialPackage: {
          materialVariantId: materialVariantId,
        },
        status: {
          in: [MaterialReceiptStatus.AVAILABLE],
        },
        remainQuantityByPack: {
          gt: 0,
        },
      },
      include: {
        materialPackage: {
          include: {
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
          // include: materialPackageInclude,
        },
      },
    });

    const simplifiedResult = materialReceipts.map((materialReceipt) => {
      return {
        id: materialReceipt.id,
        code: materialReceipt.code,
        expireDate: materialReceipt.expireDate,
        importDate: materialReceipt.importDate,
        remainQuantityByPack: materialReceipt.remainQuantityByPack,
        remainQuantityByUom:
          materialReceipt.remainQuantityByPack *
          materialReceipt.materialPackage.uomPerPack,
        materialPackage: {
          id: materialReceipt.materialPackage.id,
          // code: materialReceipt.materialPackage.code,
          name: materialReceipt.materialPackage.name,
          uomPerPack: materialReceipt.materialPackage.uomPerPack,
          materialVariant: {
            id: materialReceipt.materialPackage.materialVariant.id,
            // code: materialReceipt.materialPackage.materialVariant.code,
            name: materialReceipt.materialPackage.materialVariant.name,
            image: materialReceipt.materialPackage.materialVariant.image,
            material: {
              id: materialReceipt.materialPackage.materialVariant.material.id,
              // code: materialReceipt.materialPackage.materialVariant.material
              //   .code,
              name: materialReceipt.materialPackage.materialVariant.material
                .name,
              materialUom: {
                name: materialReceipt.materialPackage.materialVariant.material
                  .materialUom.name,
                uomCharacter:
                  materialReceipt.materialPackage.materialVariant.material
                    .materialUom.uomCharacter,
                uomDataType:
                  materialReceipt.materialPackage.materialVariant.material
                    .materialUom.uomDataType,
              },
            },
          },
        },
      };
    });

    return apiSuccess(
      HttpStatus.OK,
      simplifiedResult,
      'Get all material receipt of material variant successfully',
    );
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
    importRequest: ImportRequest,
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
    poDeliveryId?: string,
    prismaInstance: PrismaClient = this.prismaService,
    // materialReceipts: CreateMaterialReceiptDto[],
  ) {
    if (poDeliveryId === null && importRequest.type === 'MATERIAL_RETURN') {
      const materialExportRequest =
        await prismaInstance.materialExportRequest.findUnique({
          where: {
            id: importRequest.materialExportRequestId,
          },
          include: {
            materialExportReceipt: {
              include: {
                materialExportReceiptDetail: {
                  include: {
                    materialReceipt: {
                      include: {
                        materialPackage: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      let createdMaterialReceipts = [];
      let materialReceipts: Prisma.MaterialReceiptCreateManyInput[] = [];
      for (let i = 0; i < inspectionReportDetail.length; i++) {
        if (inspectionReportDetail[i].approvedQuantityByPack !== 0) {
          const expiredDate =
            materialExportRequest.materialExportReceipt.materialExportReceiptDetail.find(
              (x) =>
                x.materialReceipt.materialPackageId ===
                inspectionReportDetail[i].materialPackageId,
            ).materialReceipt.expireDate;
          materialReceipts.push({
            importReceiptId: id,
            materialPackageId: inspectionReportDetail[i].materialPackageId,
            remainQuantityByPack:
              inspectionReportDetail[i].approvedQuantityByPack,
            quantityByPack: inspectionReportDetail[i].approvedQuantityByPack,
            expireDate: expiredDate,
          });
        }
      }

      createdMaterialReceipts =
        await prismaInstance.materialReceipt.createManyAndReturn({
          data: materialReceipts,
        });
      return createdMaterialReceipts;
    } else {
      let createdMaterialReceipts = [];
      let materialReceipts: Prisma.MaterialReceiptCreateManyInput[] = [];
      for (let i = 0; i < inspectionReportDetail.length; i++) {
        if (inspectionReportDetail[i].approvedQuantityByPack !== 0) {
          const result = await this.poDeliveryService.getExpiredDate(
            poDeliveryId,
            inspectionReportDetail[0].materialPackageId,
            prismaInstance,
          );
          materialReceipts.push({
            importReceiptId: id,
            materialPackageId: inspectionReportDetail[i].materialPackageId,
            remainQuantityByPack:
              inspectionReportDetail[i].approvedQuantityByPack,
            quantityByPack: inspectionReportDetail[i].approvedQuantityByPack,
            expireDate: result.expiredDate,
          });
        }
      }

      createdMaterialReceipts =
        await prismaInstance.materialReceipt.createManyAndReturn({
          data: materialReceipts,
        });
      return createdMaterialReceipts;
    }
  }

  async updateMaterialReceiptQuantity(
    id: string,
    quantityByPack: number,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const materialReceipt = await this.findById(id);
    if (!materialReceipt) {
      throw new Error('Material Receipt not found');
    }
    await prismaInstance.materialReceipt.update({
      where: {
        id,
      },
      data: {
        remainQuantityByPack: quantityByPack,
        ...(quantityByPack === 0 && { status: MaterialReceiptStatus.USED }),
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
  }

  create(createMaterialReceiptDto: CreateMaterialReceiptDto) {
    return 'This action adds a new materialReceipt';
  }

  async findAll() {
    const materialReceipts = await this.prismaService.materialReceipt.findMany({
      include: materialReceiptIncludeWithoutImportReceipt,
    });

    return apiSuccess(
      HttpStatus.OK,
      materialReceipts,
      'Get all material receipt successfully',
    );
  }

  async findAllLite() {
    const materialReceipts = await this.prismaService.materialReceipt.findMany({
      include: {
        materialPackage: {
          include: {
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
      },
    });

    return apiSuccess(
      HttpStatus.OK,
      materialReceipts,
      'Get all material receipt successfully',
    );
  }

  async searchWithoutPage(
    findOptions: GeneratedFindOptions<Prisma.MaterialReceiptWhereInput>,
  ) {
    const materialReceipts = await this.prismaService.materialReceipt.findMany({
      ...findOptions,
      include: materialReceiptIncludeWithoutImportReceipt,
    });
    return apiSuccess(
      HttpStatus.OK,
      materialReceipts,
      'Search all material receipt successfully',
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
      include: materialReceiptIncludeWithoutImportReceipt,
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
