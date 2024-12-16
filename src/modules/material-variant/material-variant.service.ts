import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ExportReceiptStatus,
  MaterialReceiptStatus,
  Prisma,
  ReOrderAlertStatus,
} from '@prisma/client';
import { isUUID } from 'class-validator';
import { materialPackageInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant, months } from 'src/common/constant/constant';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta, nonExistUUID } from 'src/common/utils/utils';
import { ImageService } from '../image/image.service';
import { MaterialAttributeService } from '../material-attribute/material-attribute.service';
import { MaterialPackageService } from '../material-package/material-package.service';
import { ChartDto } from './dto/chart.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { MaterialStock } from './dto/stock-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

type History = {
  materialReceiptId?: string;
  materialExportReceiptDetailId?: string;
  receiptAdjustmentId?: string;
  importReceiptId?: string;
  materialExportReceiptId?: string;
  inventoryReportId?: string;
  quantityByPack: number;
  type: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface MaterialVariant
  extends Prisma.MaterialVariantGetPayload<{
    include: {
      materialAttribute: true;
      material: {
        include: {
          materialUom: true;
        };
      };
      materialPackage: {
        include: {
          materialReceipt: {
            include: {
              materialExportReceiptDetail: {
                include: {
                  materialExportReceipt: true;
                };
              };
              receiptAdjustment: {
                include: {
                  inventoryReportDetail: {
                    include: {
                      inventoryReport: true;
                    };
                  };
                };
              };
              importReceipt: true;
            };
          };
          inventoryStock: true;
        };
      };
    };
  }> {
  history?: History[];
}

@Injectable()
export class MaterialVariantService {
  async findHistoryDisposedByIdWithResponse(
    id: string,
    sortBy: string,
    findOptions: GeneratedFindOptions<Prisma.MaterialVariantScalarWhereWithAggregatesInput>,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Id is invalid');
    }
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = (await this.prismaService.$transaction([
      this.prismaService.materialVariant.findFirst({
        where: { id },
        include: this.materialHistoryInclude,
      }),
      this.prismaService.materialVariant.count({
        where: { id },
      }),
    ])) as [MaterialVariant, number];

    if (!result) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }
    result.history = [];

    result.materialPackage.forEach((materialPackage) => {
      materialPackage?.materialReceipt?.forEach((materialReceipt) => {
        if (materialReceipt.status == MaterialReceiptStatus.DISPOSED) {
          result.history.push({
            materialReceiptId: materialReceipt.id,
            quantityByPack: materialReceipt.quantityByPack,
            code: materialReceipt.importReceipt.code,
            type: 'DISPOSED',
            createdAt: materialReceipt.createdAt,
            updatedAt: materialReceipt.updatedAt,
          });
        }
      });
    });

    let length = result.history.length;
    result.history = result?.history
      ?.sort((a, b) => {
        if (sortBy === 'asc') {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(offset, offset + limit);

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result.history,
        pageMeta: getPageMeta(length, offset, limit),
      },
      'Material History found',
    );
  }
  async getOneDisposed(id: string) {
    const result = await this.searchDisposed({
      orderBy: undefined,
      skip: undefined,
      take: undefined,
      where: {
        id,
      },
    });
    if (result.data.data.length === 0) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }
    return apiSuccess(HttpStatus.OK, result.data.data[0], 'Material found');
  }
  async searchDisposed(
    findOptions: GeneratedFindOptions<Prisma.MaterialVariantScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialVariant.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: this.materialStockInclude,
      }),
      this.prismaService.materialVariant.count({
        where: findOptions?.where,
      }),
    ]);
    let processedMaterials = data.map((material: MaterialStock) => {
      let onHand = 0; // Initialize the total onHand quantity
      material.onHand = 0;
      material.onHandUom = 0;

      // Filter and process material packages
      material.materialPackage = material.materialPackage.filter(
        (materialPackage) => {
          let materialPackageOnHand = 0; // On-hand quantity for this package

          // Filter receipts with DISPOSED status
          materialPackage.materialReceipt =
            materialPackage.materialReceipt.filter((materialReceipt) => {
              if (materialReceipt.status === MaterialReceiptStatus.DISPOSED) {
                materialPackageOnHand += materialReceipt.remainQuantityByPack; // Add the quantity to the package onHand
                onHand += materialReceipt.remainQuantityByPack; // Add to material's total onHand
                material.onHandUom +=
                  materialReceipt.remainQuantityByPack *
                  materialPackage.uomPerPack; // Update total onHandUom
                return true; // Keep this receipt
              }
              return false; // Discard this receipt
            });

          // Update inventory stock with the calculated on-hand quantity
          if (materialPackage.inventoryStock) {
            materialPackage.inventoryStock.quantityByPack =
              materialPackageOnHand;
          }

          return materialPackage.materialReceipt.length > 0; // Keep the package if it has at least one DISPOSED receipt
        },
      );

      // Update the material's calculated fields
      material.numberOfMaterialPackage = material.materialPackage.length; // Number of remaining packages
      material.onHand = onHand; // Total onHand quantity
      return material;
    });

    processedMaterials = processedMaterials.filter(
      (material) => material.onHand > 0,
    );

    const dataResponse: DataResponse = {
      data: processedMaterials,
      pageMeta: getPageMeta(processedMaterials.length, offset, limit),
    };

    return apiSuccess(HttpStatus.OK, dataResponse, 'List of Material');
  }
  async updateReorderAlert(
    id: string,
    currentQuantityByUom: number,
    reorderLevel: number,
  ) {
    const el = await this.prismaService.reorderAlert.findFirst({
      where: { materialVariantId: id, status: ReOrderAlertStatus.OPEN },
    });
    if (!el) {
      return { result: null, operation: 'NO_OPERATION' };
    }
    const result = await this.prismaService.reorderAlert.update({
      where: { id: el.id },
      data: {
        currentQuantityByUom: currentQuantityByUom,
        status: ReOrderAlertStatus.CLOSED,
        closedAt: new Date(),
      },
    });
    return { result, operation: 'updated' };
  }
  async createReOrderAlert(
    materialVariantId: string,
    currentQuantity: number,
    reorderLevel: number,
  ) {
    const el = await this.prismaService.reorderAlert.findFirst({
      where: { materialVariantId, status: ReOrderAlertStatus.OPEN },
    });
    const result = await this.prismaService.reorderAlert.upsert({
      where: { id: el?.id || nonExistUUID },
      create: {
        materialVariantId,
        currentQuantityByUom: currentQuantity,
        reorderQuantityByUom: reorderLevel,
        status: ReOrderAlertStatus.OPEN,
        openedAt: new Date(),
      },
      update: {
        currentQuantityByUom: currentQuantity,
        status: ReOrderAlertStatus.OPEN,
      },
    });
    const operation = el ? 'updated' : 'created';

    return { result, operation };
  }

  async findReOrderAlertByMaterialVariantId(materialVariantId: string) {
    const result = await this.prismaService.reorderAlert.findMany({
      where: {
        materialVariantId,
      },
    });
    return result;
  }

  async findAllOpenReOrderAlert() {
    const result = await this.prismaService.reorderAlert.findMany({
      where: {
        status: 'OPEN',
      },
      include: {
        materialVariant: true,
      },
    });
    return apiSuccess(HttpStatus.OK, result, 'List of ReOrder Alert');
  }

  async closeReOrderAlert(id: string) {
    const result = await this.prismaService.reorderAlert.update({
      where: { id },
      data: {
        status: ReOrderAlertStatus.CLOSED,
        closedAt: new Date(),
      },
    });
    return apiSuccess(HttpStatus.OK, result, 'ReOrder Alert closed');
  }

  async isMaterialVariantAtReOrderLevel(materialVariantId: string) {
    const materialVariant = await this.prismaService.materialVariant.findFirst({
      where: { id: materialVariantId },
      include: {
        materialPackage: {
          include: {
            inventoryStock: true,
            materialReceipt: {
              where: {
                status: MaterialReceiptStatus.AVAILABLE,
              },
            },
          },
        },
      },
    });
    const totalQuantity = materialVariant.materialPackage.reduce(
      (totalAcc, materialPackageEl) => {
        let variantTotal = 0;
        variantTotal =
          materialPackageEl.inventoryStock?.quantityByPack *
            materialPackageEl.uomPerPack || 0;
        // materialPackageEl.materialReceipt.forEach((materialReceipt) => {
        //   variantTotal +=
        //     materialReceipt.quantityByPack * materialPackageEl.uomPerPack;
        // });
        return totalAcc + variantTotal;
      },
      0,
    );
    const isAtReorderAlert = totalQuantity <= materialVariant.reorderLevel;
    return {
      isAtReorderAlert,
      currentQuantityByUom: totalQuantity,
    };
  }

  async findHistoryByIdWithResponse(
    id: string,
    sortBy: string,
    findOptions: GeneratedFindOptions<Prisma.MaterialVariantScalarWhereWithAggregatesInput>,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Id is invalid');
    }
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = (await this.prismaService.$transaction([
      this.prismaService.materialVariant.findFirst({
        where: { id },
        include: this.materialHistoryInclude,
      }),
      this.prismaService.materialVariant.count({
        where: { id },
      }),
    ])) as [MaterialVariant, number];

    if (!result) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }
    result.history = [];

    result.materialPackage.forEach((materialPackage) => {
      materialPackage?.materialReceipt?.forEach((materialReceipt) => {
        if (materialReceipt.status) {
          materialReceipt?.materialExportReceiptDetail?.forEach(
            (materialExportReceiptDetail) => {
              if (
                materialExportReceiptDetail.materialExportReceipt.type ===
                'DISPOSED'
              ) {
                result.history.push({
                  materialExportReceiptDetailId: materialExportReceiptDetail.id,
                  materialExportReceiptId:
                    materialExportReceiptDetail.materialExportReceiptId,
                  quantityByPack: -materialExportReceiptDetail.quantityByPack,
                  code: materialExportReceiptDetail?.materialExportReceipt.code,
                  type: 'EXPORT_RECEIPT',
                  createdAt: materialExportReceiptDetail.createdAt,
                  updatedAt: materialExportReceiptDetail.updatedAt,
                });
              }
            },
          );
        }
      });
    });

    let length = result.history.length;
    result.history = result?.history
      ?.sort((a, b) => {
        if (sortBy === 'asc') {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(offset, offset + limit);

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result.history,
        pageMeta: getPageMeta(length, offset, limit),
      },
      'Material History found',
    );
  }
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageService: ImageService,
    private readonly materialPackageService: MaterialPackageService,
    private readonly materialAttributeService: MaterialAttributeService,
  ) {}

  materialInclude: Prisma.MaterialVariantInclude = {
    materialAttribute: true,
    materialPackage: {
      include: {
        materialReceipt: true,
        inventoryStock: true,
      },
    },
    material: {
      include: {
        materialUom: true,
      },
    },
  };

  materialStockInclude = {
    materialAttribute: true,
    material: {
      include: {
        materialUom: true,
      },
    },
    materialPackage: {
      include: {
        materialReceipt: {
          include: {
            materialExportReceiptDetail: true,
            receiptAdjustment: true,
            importReceipt: true,
          },
        },
        inventoryStock: true, // Make sure to include inventoryStock
      },
    },
  };

  materialHistoryInclude = {
    materialAttribute: true,
    material: {
      include: {
        materialUom: true,
      },
    },
    materialPackage: {
      include: {
        materialReceipt: {
          include: {
            materialExportReceiptDetail: {
              include: {
                materialExportReceipt: true,
              },
            },
            receiptAdjustment: {
              include: {
                inventoryReportDetail: {
                  include: {
                    inventoryReport: true,
                  },
                },
              },
            },
            importReceipt: true,
          },
        },
        inventoryStock: true,
      },
    },
  };

  findByQuery(query: any) {
    return this.prismaService.materialVariant.findFirst({
      where: query,
      include: this.materialInclude,
    });
  }

  async findAllMaterialHasReceipt() {
    return this.prismaService.materialVariant.findMany({
      where: {
        materialPackage: {
          some: {
            materialReceipt: {
              some: {
                status: MaterialReceiptStatus.AVAILABLE,
              },
            },
          },
        },
      },
      include: this.materialInclude,
    });
  }

  async findMaterialHasReceipt(
    findOptions: GeneratedFindOptions<Prisma.MaterialVariantScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialVariant.findMany({
        skip: offset,
        take: limit,
        orderBy: findOptions?.orderBy,
        where: {
          materialPackage: {
            some: {
              materialReceipt: {
                some: {
                  status: MaterialReceiptStatus.AVAILABLE,
                },
              },
            },
          },
        },
        include: this.materialInclude,
      }),
      this.prismaService.materialVariant.count({
        where: {
          materialPackage: {
            some: {
              materialReceipt: {
                some: {
                  status: MaterialReceiptStatus.AVAILABLE,
                },
              },
            },
          },
        },
      }),
    ]);

    data.forEach((material: any) => {
      material.numberOfMaterialPackage = material.materialPackage.length;
      material.onHand = material?.materialPackage?.reduce(
        (totalAcc, materialVariantEl) => {
          let variantTotal = 0;
          //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
          if (materialVariantEl.inventoryStock) {
            variantTotal = materialVariantEl.inventoryStock.quantityByPack;
          }
          return totalAcc + variantTotal;
        },
        0,
      );
    });

    return apiSuccess(
      HttpStatus.OK,
      {
        data,
        pageMeta: getPageMeta(total, offset, limit),
      },
      'List of Material with Receipt',
    );
  }

  async findMaterialExportReceipt(
    id: string,
    findOptions: GeneratedFindOptions<Prisma.MaterialExportReceiptDetailScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialExportReceiptDetail.findMany({
        skip: offset,
        take: limit,
        orderBy: findOptions?.orderBy,
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
        },
        include: {
          materialReceipt: {
            include: {
              materialPackage: true,
            },
          },
        },
      }),
      this.prismaService.materialExportReceiptDetail.count({
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
        },
      }),
    ]);
    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(
      HttpStatus.OK,
      dataResponse,
      'List of Material Export Receipt',
    );
  }

  async findMaterialImportReceipt(id: string, findOptions: any) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const whereCondition = {
      ...findOptions?.where,
      status: {
        notIn: [MaterialReceiptStatus.DISPOSED],
        ...findOptions?.where?.status,
      },
      materialPackage: {
        materialVariantId: id,
      },
    };
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialReceipt.findMany({
        skip: offset,
        take: limit,
        orderBy: findOptions?.orderBy,
        where: whereCondition,
        include: {
          materialPackage: true,
        },
      }),
      this.prismaService.materialReceipt.count({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
      }),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(HttpStatus.OK, dataResponse, 'List of Material Receipt');
  }

  async findDisposedMaterialImportReceipt(id: string, findOptions: any) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const whereCondition = {
      ...findOptions?.where,
      status: {
        in: [MaterialReceiptStatus.DISPOSED],
      },
      materialPackage: {
        materialVariantId: id,
      },
    };
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialReceipt.findMany({
        skip: offset,
        take: limit,
        orderBy: findOptions?.orderBy,
        where: whereCondition,
        include: {
          materialPackage: true,
        },
      }),
      this.prismaService.materialReceipt.count({
        where: whereCondition,
      }),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(HttpStatus.OK, dataResponse, 'List of Material Receipt');
  }

  async getAllMaterialReceiptOfMaterialPackage(materialPackageId: any) {
    throw new Error('Method not implemented.');
  }

  async getChart(chartDto: ChartDto) {
    const materialVariantIds = chartDto.materialVariantId || [];
    let additionQuery: Prisma.MaterialReceiptWhereInput;
    let additionExportReceiptQuery: Prisma.MaterialExportReceiptDetailWhereInput;

    if (materialVariantIds.length > 0) {
      additionQuery = {
        materialPackage: {
          materialVariantId: {
            in: materialVariantIds,
          },
        },
      };
      additionExportReceiptQuery = {
        materialReceipt: {
          materialPackage: {
            materialVariantId: {
              in: materialVariantIds,
            },
          },
        },
      };
    }
    const { year } = chartDto;
    const monthlyData = [];

    for (let month = 0; month < 12; month++) {
      const from = new Date(year, month, 1);
      const to = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const importMaterialReceipt =
        await this.prismaService.materialReceipt.findMany({
          where: {
            AND: {
              ...additionQuery,
              createdAt: {
                gte: from,
                lte: to,
              },
              status: {
                in: [
                  // MaterialReceiptStatus.PARTIAL_USED,
                  MaterialReceiptStatus.AVAILABLE,
                ],
              },
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
            },
          },
        });

      //TODO: Need to check if this is correct after doing materialExportReceipt
      const exportMaterialReceipt =
        await this.prismaService.materialExportReceiptDetail.findMany({
          where: {
            AND: {
              ...additionExportReceiptQuery,
              createdAt: {
                gte: from,
                lte: to,
              },
            },
            materialExportReceipt: {
              status: ExportReceiptStatus.EXPORTED,
            },
          },
          include: {
            materialReceipt: {
              include: {
                materialPackage: {
                  include: materialPackageInclude,
                },
              },
            },
          },
        });

      const totalQuantities = this.calculateTotalQuantities(
        importMaterialReceipt,
        exportMaterialReceipt,
      );
      monthlyData.push({
        month: month + 1,
        data: totalQuantities,
      });
    }

    return apiSuccess(
      HttpStatus.OK,
      {
        monthlyData,
      },
      'Material Receipt found for each month',
    );
  }

  private calculateTotalQuantities(
    materialReceipt: any[],
    exportMaterialReceipt: any[],
  ) {
    const totals: Record<
      string,
      {
        materialVariant: any;
        totalImportQuantityByUom: number;
        totalExportQuantityByUom: number;
        totalImportQuantityByPack: number;
        totalExportQuantityByPack: number;
      }
    > = {};

    materialReceipt.reduce((acc, el) => {
      const materialVariant = el.materialPackage.materialVariant;
      const materialVariantId = materialVariant.id;
      const importQuantity = el.quantityByPack * el.materialPackage.uomPerPack;
      const importQuantityByPack = el.quantityByPack;
      if (acc[materialVariantId]) {
        acc[materialVariantId].totalImportQuantityByUom += importQuantity;
        acc[materialVariantId].totalImportQuantityByPack +=
          importQuantityByPack;
      } else {
        acc[materialVariantId] = {
          materialVariant,
          totalImportQuantityByUom: importQuantity,
          totalImportQuantityByPack: importQuantityByPack,
          totalExportQuantityByPack: 0,
          totalExportQuantityByUom: 0,
        };
      }

      return acc;
    }, totals);

    // console.log(exportMaterialReceipt.materialReceiptDetail);
    exportMaterialReceipt.reduce((acc, el) => {
      console.log(el);
      const materialVariant =
        el.materialReceipt.materialPackage.materialVariant;
      const materialVariantId = materialVariant.id;
      const exportQuantity =
        el.quantityByPack * el.materialReceipt.materialPackage.uomPerPack;
      const exportQuantityByPack = el.quantityByPack;

      if (acc[materialVariantId]) {
        acc[materialVariantId].totalExportQuantityByPack +=
          exportQuantityByPack;
        acc[materialVariantId].totalExportQuantityByUom += exportQuantity;
      } else {
        acc[materialVariantId] = {
          materialVariant,
          totalImportQuantityByUom: 0,
          totalImportQuantityByPack: 0,
          totalExportQuantityByPack: exportQuantityByPack,
          totalExportQuantityByUom: exportQuantity,
        };
      }

      return acc;
    }, totals);

    const result = Object.values(totals);

    return result;
  }

  findMaterialReceiptChart(id: string, months: months[]) {}

  async findMaterialReceiptByIdWithResponse(id: string) {
    const [
      materialImportReceipt,
      materialExportReceipt,
      materialImportReceiptCount,
      materialExportReceiptCount,
    ] = await this.prismaService.$transaction([
      this.prismaService.materialReceipt.findMany({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
        include: {
          materialPackage: true,
        },
      }),
      this.prismaService.materialExportReceipt.findMany({
        //TODO
        // where: {
        //   materialReceipt: {
        //     materialPackage: {
        //       materialVariantId: id,
        //     },
        //   },
        // },
        // include: {
        //   materialReceipt: {
        //     include: {
        //       materialPackage: true,
        //     },
        //   },
        // },
      }),
      this.prismaService.materialReceipt.count({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
      }),
      this.prismaService.materialExportReceipt.count({
        where: {
          //TODO
          // materialReceipt: {
          //   materialPackage: {
          //     materialVariantId: id,
          //   },
          // },
        },
      }),
    ]);

    return apiSuccess(
      HttpStatus.OK,
      {
        materialImportReceipt,
        materialExportReceipt,
        materialImportReceiptCount,
        materialExportReceiptCount,
      },
      'Material Receipt found',
    );
  }

  async findMaterialReceiptByIdWithResponse2(id: string) {
    const [
      materialImportReceipt,
      materialExportReceipt,
      materialImportReceiptCount,
      materialExportReceiptCount,
    ] = await this.prismaService.$transaction([
      this.prismaService.materialReceipt.findMany({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
        include: {
          materialPackage: true,
        },
      }),
      //TODO: Need to check if this is correct after doing materialExportReceipt
      this.prismaService.materialExportReceiptDetail.findMany({
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
        },
        include: {
          materialReceipt: {
            include: {
              materialPackage: true,
            },
          },
        },
      }),
      this.prismaService.materialReceipt.count({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
      }),
      this.prismaService.materialExportReceiptDetail.count({
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
        },
      }),
    ]);

    const result = [];

    materialImportReceipt.forEach((el) => {
      result.push({
        ...el,
        type: 'importReceipt',
      });
    });

    materialExportReceipt.forEach((el) => {
      result.push({
        ...el,
        type: 'exportReceipt',
      });
    });

    return apiSuccess(HttpStatus.OK, result, 'Material Receipt found');
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.MaterialVariantScalarWhereWithAggregatesInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialVariant.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: this.materialStockInclude,
      }),
      this.prismaService.materialVariant.count({
        where: findOptions?.where,
      }),
    ]);
    let onHand = 0;
    data.forEach((material: MaterialStock) => {
      onHand = 0;
      material.onHand = 0;
      material.onHandUom = 0;
      material.materialPackage.forEach((materialPackage) => {
        let materialPackageOnHand = 0;
        if (materialPackage.materialReceipt.length > 0) {
          materialPackage.materialReceipt.forEach((materialReceipt) => {
            if (materialReceipt.status == MaterialReceiptStatus.AVAILABLE) {
              materialPackageOnHand += materialReceipt.remainQuantityByPack;
              onHand += materialReceipt.remainQuantityByPack;
              material.onHandUom +=
                materialReceipt.remainQuantityByPack *
                materialPackage.uomPerPack;
            }
          });
          if (materialPackage.inventoryStock) {
            materialPackage.inventoryStock.quantityByPack =
              materialPackageOnHand;
          }
        }
      });

      material.numberOfMaterialPackage = material.materialPackage.length;
      material.onHand = onHand;
      // material.onHand = material?.materialPackage?.reduce(
      //   (totalAcc, materialVariantEl) => {
      //     let variantTotal = 0;
      //     //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
      //     if (materialVariantEl.inventoryStock) {
      //       variantTotal = materialVariantEl.inventoryStock.quantityByPack;
      //     }
      //     return totalAcc + variantTotal;
      //   },
      //   0,
      // );
    });

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(HttpStatus.OK, dataResponse, 'List of Material');
  }

  async addImage(file: Express.Multer.File, id: string) {
    const materialVariant = await this.findById(id);
    let oldImageUrl = '';
    if (!materialVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    if (materialVariant.image) {
      oldImageUrl = materialVariant.image;
    }

    const imageUrl = await this.imageService.addImageToFirebase(
      file,
      id,
      PathConstants.MATERIAL_PATH,
    );
    let result;
    if (imageUrl) {
      const updateMaterialDto: UpdateMaterialDto = {
        image: imageUrl,
      };
      result = await this.update(id, updateMaterialDto);
    }

    //To ignore this error
    try {
      await this.imageService.deleteImageUrl(oldImageUrl);
    } catch (e) {}

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Image uploaded successfully');
    }

    return apiFailed(HttpStatus.BAD_REQUEST, 'Image not uploaded');
  }

  async addImageWithoutResponse(file: Express.Multer.File, id: string) {
    const imageUrl = await this.imageService.addImageToFirebase(
      file,
      id,
      PathConstants.MATERIAL_PATH,
    );
    let result;
    if (imageUrl) {
      const updateMaterialDto: UpdateMaterialDto = {
        image: imageUrl,
      };
      result = await this.update(id, updateMaterialDto);
    }
    return result;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto) {
    const materialVariant = await this.findById(id);
    if (!materialVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    const result = await this.prismaService.materialVariant.update({
      where: { id },
      data: updateMaterialDto,
    });

    return result;
  }

  async updateWithResponse(id: string, updateMaterialDto: UpdateMaterialDto) {
    const materialVariant = await this.findById(id);
    if (!materialVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    const result = await this.prismaService.materialVariant.update({
      where: { id },
      data: updateMaterialDto,
    });

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material updated successfully');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Material not updated');
  }

  async create(
    createMaterialDto: CreateMaterialDto,
    file?: Express.Multer.File,
  ) {
    const { materialId, code, materialPackages, materialAttributes, ...rest } =
      createMaterialDto;

    const materialInput: Prisma.MaterialVariantCreateInput = {
      ...rest,
      code: code ? code.toUpperCase() : undefined,
      material: {
        connect: {
          id: materialId,
        },
      },
    };

    const result = await this.prismaService.materialVariant.create({
      data: materialInput,
      include: this.materialInclude,
    });
    let errorResponse = [];

    try {
      if (createMaterialDto.materialAttributes) {
        const resultAttribute =
          await this.materialAttributeService.createManyWithMaterialVariantId(
            createMaterialDto.materialAttributes,
            result.id,
          );
        result.materialAttribute = resultAttribute;
      }
    } catch (e) {
      errorResponse.push(e);
    }

    try {
      if (createMaterialDto.materialPackages) {
        const resultPackage =
          await this.materialPackageService.createManyWithMaterialVariantId(
            createMaterialDto.materialPackages,
            result.id,
          );
        result.materialPackage = resultPackage;
      }
    } catch (e) {
      errorResponse.push(e);
    }

    try {
      if (file) {
        const imageUrl = await this.addImageWithoutResponse(file, result.id);
        if (imageUrl) {
          result.image = imageUrl.image;
        }
      }
    } catch (e) {
      errorResponse.push(e);
    }

    if (errorResponse.length > 0) {
      if (result) {
        return apiFailed(
          HttpStatus.BAD_REQUEST,
          'Material created successfully but some error occured',
          errorResponse,
        );
      }
    }

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Material created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Material not created');
  }

  async findAll() {
    const result = await this.prismaService.materialVariant.findMany({
      include: this.materialInclude,
    });
    return apiSuccess(HttpStatus.OK, result, 'List of Material');
  }

  findAllWithoutResponse() {
    const result = this.prismaService.materialVariant.findMany({
      include: this.materialInclude,
    });
    return result;
  }

  findAllWithoutResponseMinimizeInlude() {
    const result = this.prismaService.materialVariant.findMany({
      // include:{
      //   materialPackage: true,
      // },
    });
    return result;
  }

  findMaterialStock() {
    return this.prismaService.materialVariant.findMany({
      include: {
        materialAttribute: true,
        material: {
          include: {
            materialUom: true,
          },
        },
        materialPackage: {
          include: {
            inventoryStock: true,
          },
        },
      },
    });
  }

  async findByIdWithResponse(id: string) {
    const result = (await this.findById(id)) as MaterialVariant;
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result: MaterialStock =
      await this.prismaService.materialVariant.findFirst({
        where: { id },
        include: this.materialStockInclude,
      });
    if (!result) {
      return null;
    }
    let onHand = 0;
    if (result.materialPackage) {
      result.onHandUom = 0;
      result.materialPackage.forEach((materialPackage) => {
        let materialPackageOnHand = 0;
        if (materialPackage?.materialReceipt) {
          materialPackage.materialReceipt.forEach((materialReceipt) => {
            if (materialReceipt.status == MaterialReceiptStatus.AVAILABLE) {
              materialPackageOnHand += materialReceipt.remainQuantityByPack;
              onHand += materialReceipt.remainQuantityByPack;
              result.onHandUom +=
                materialReceipt.remainQuantityByPack *
                materialPackage.uomPerPack;
            }
          });
          if (materialPackage.inventoryStock) {
            materialPackage.inventoryStock.quantityByPack =
              materialPackageOnHand;
          }
        } else {
        }
      });
      result.numberOfMaterialPackage = result.materialPackage.length
        ? result.materialPackage.length
        : 0;
      result.onHand = onHand;
    } else {
      result.numberOfMaterialPackage = 0;
      result.onHand = 0;
    }

    return result;
  }

  async findByMaterialCode(materialCode: string) {
    const result = await this.prismaService.materialVariant.findFirst({
      where: { code: materialCode },
      include: this.materialInclude,
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async findByMaterialCodeWithoutResponse(materialCode: string) {
    const result = await this.prismaService.materialVariant.findFirst({
      where: { code: materialCode },
      include: this.materialInclude,
    });
    return result;
  }

  async findByMaterialType(materialType: string) {
    const result = await this.prismaService.materialVariant.findMany({
      where: { material: { id: materialType } },
      include: this.materialInclude,
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async getAllMaterialReceiptOfMaterialVariant(id: string) {
    const result = await this.prismaService.materialReceipt.findMany({
      where: {
        AND: {
          materialPackage: {
            materialVariantId: id,
          },
          status: {
            in: [
              // MaterialReceiptStatus.PARTIAL_USED,
              MaterialReceiptStatus.AVAILABLE,
            ],
          },
        },
      },
    });
    return result;
  }
}
