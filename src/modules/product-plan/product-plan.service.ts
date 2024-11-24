import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, ProductionStatus } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { getPageMeta, getPurchaseOrderStatistic } from 'src/common/utils/utils';
import { ExcelService } from '../excel/excel.service';
import { ProductPlanDetailService } from '../product-plan-detail/product-plan-detail.service';
import { CreateProductPlanDto } from './dto/create-product-plan.dto';
import { UpdateProductPlanDto } from './dto/update-product-plan.dto';

@Injectable()
export class ProductPlanService {
  constructor(
    private prismaService: PrismaService,
    private readonly excelService: ExcelService,
    private readonly productPlanDetailService: ProductPlanDetailService,
  ) {}

  includeQuery: Prisma.ProductionPlanInclude = {
    purchaseOrder: {
      include: {
        purchasingStaff: {
          include: {
            account: true,
          },
        },
        supplier: true,
        poDelivery: {
          include: {
            importRequest: true,
            poDeliveryDetail: {
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
            },
          },
        },
      },
    },
    productionPlanDetail: {
      include: {
        productionBatch: {
          include: {
            importRequest: {
              include: {
                inspectionRequest: {
                  include: {
                    inspectionReport: {
                      include: {
                        importReceipt: {
                          include: {
                            productReceipt: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        productSize: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    productUom: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  async startProductionPlan(id: string, status: ProductionStatus) {
    const productionPlan = await this.findById(id);
    if (!productionPlan) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Production Plan not found');
    }
    if (productionPlan.status === ProductionStatus.IN_PROGRESS) {
      return apiFailed(
        HttpStatus.CONFLICT,
        'Production Plan is already in progress',
      );
    }
    if (productionPlan.status === ProductionStatus.FINISHED) {
      return apiFailed(
        HttpStatus.CONFLICT,
        'Production Plan is already completed',
      );
    }
    const result = await this.prismaService.productionPlan.update({
      where: { id },
      data: { status },
    });

    return apiSuccess(
      HttpStatus.OK,
      result,
      'Production Plan started successfully',
    );
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const result = await this.prismaService.productionPlan.findUnique({
      where: { id },
      include: this.includeQuery,
    });
    return result;
  }

  findValidProductionPlan(productionPlanId: string) {
    return this.prismaService.productionPlan.findFirst({
      where: {
        AND: {
          id: productionPlanId,
          status: ProductionStatus.IN_PROGRESS,
        },
      },
    });
  }

  async createProductPlanWithExcelFile(
    file: Express.Multer.File,
    factoryDirectorId: string,
  ) {
    const excelData = await this.excelService.readProductionPlanExcel(file);
    if (excelData instanceof ApiResponse) {
      return excelData;
    }

    const createProductPlanData = excelData as CreateProductPlanDto;
    const productPlanInput: Prisma.ProductionPlanCreateInput = {
      factoryDirector: {
        connect: { id: factoryDirectorId },
      },
      name: createProductPlanData.name,
      note: createProductPlanData.note,
      expectedStartDate: createProductPlanData.expectedStartDate,
      expectedEndDate: createProductPlanData.expectedEndDate,
      code: undefined,
    };
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaClient) => {
        const productionPlanResult: any =
          await prismaInstance.productionPlan.create({
            data: productPlanInput,
          });

        const productPlanItems =
          createProductPlanData.productionPlanDetails.map((item) => {
            const { code, ...rest } = item; // Remove the 'code' field
            return {
              ...rest,
              productionPlanId: productionPlanResult.id,
            };
          });
        const productionPlanDetail =
          await this.productPlanDetailService.createMany(
            productPlanItems,
            prismaInstance,
          );

        productionPlanResult.productionPlanDetails = productionPlanDetail;

        return productionPlanResult;
      },
    );

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product Plan created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Product Plan');
  }

  async findAll(
    filterOption?: GeneratedFindOptions<Prisma.ProductionPlanWhereInput>,
  ) {
    const { skip, take, ...rest } = filterOption;
    const page = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.productionPlan.findMany({
        skip: page,
        take: limit,
        where: {
          ...rest?.where,
        },
        include: this.includeQuery,
      }) as any,
      this.prismaService.productionPlan.count({
        where: {
          ...rest?.where,
        },
      }),
    ]);

    result.forEach((productionPlan) => {
      let totalQuantityToProduce = 0;
      let totalProducedQuantity = 0;
      let totalDefectQuantity = 0;
      productionPlan.productionPlanDetail.forEach((detail) => {
        totalQuantityToProduce += detail.quantityToProduce;
      });
      productionPlan.totalQuantityToProduce = totalQuantityToProduce;
      productionPlan.productionPlanDetail.forEach((detail) => {
        if (detail.productionBatch.length > 0) {
          detail.productionBatch.forEach((batch) => {
            // if (batch.status === ProductionStatus.FINISHED) {
            batch.importRequest.forEach((request) => {
              request.inspectionRequest.forEach((inspection) => {
                inspection.inspectionReport?.importReceipt?.productReceipt.forEach(
                  (productReceipt) => {
                    if (productReceipt.isDefect) {
                      totalDefectQuantity += productReceipt.quantityByUom;
                    } else {
                      totalProducedQuantity += productReceipt.quantityByUom;
                    }
                  },
                );
              });
            });
            // }
          });
        }
      });
      productionPlan.purchaseOrder.forEach((purchaseOrder: any) => {
        const [
          totalImportQuantity,
          totalFailImportQuantity,
          totalQuantityToImport,
          totalPoDelivery,
          totalFinishedPoDelivery,
          totalInProgressPoDelivery,
          totalCancelledPoDelivery,
          totalPendingPoDelivery,
        ] = getPurchaseOrderStatistic(purchaseOrder);

        purchaseOrder.totalImportQuantity = totalImportQuantity;
        purchaseOrder.totalFailImportQuantity = totalFailImportQuantity;
        purchaseOrder.totalQuantityToImport = totalQuantityToImport;
        purchaseOrder.totalPoDelivery = totalPoDelivery;
        purchaseOrder.totalFinishedPoDelivery = totalFinishedPoDelivery;
        purchaseOrder.totalInProgressPoDelivery = totalInProgressPoDelivery;
        purchaseOrder.totalCancelledPoDelivery = totalCancelledPoDelivery;
        purchaseOrder.totalPendingPoDelivery = totalPendingPoDelivery;
      });

      productionPlan.totalQuantityToProduce = totalQuantityToProduce;
      productionPlan.totalProducedQuantity = totalProducedQuantity;
      productionPlan.totalDefectQuantity = totalDefectQuantity;
    });

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'List of Production plan',
    );
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new Error('Invalid UUID');
    }

    const productPlan: any = await this.prismaService.productionPlan.findUnique(
      {
        where: { id },
        include: {
          purchaseOrder: {
            include: {
              purchasingStaff: {
                include: {
                  account: true,
                },
              },
              supplier: true,
              poDelivery: {
                include: {
                  importRequest: true,
                  poDeliveryDetail: {
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
                  },
                },
              },
            },
          },
          productionPlanDetail: {
            include: {
              productionBatch: {
                include: {
                  importRequest: {
                    include: {
                      inspectionRequest: {
                        include: {
                          inspectionReport: {
                            include: {
                              importReceipt: {
                                include: {
                                  productReceipt: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              productSize: {
                include: {
                  productVariant: {
                    include: {
                      product: {
                        include: {
                          productUom: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    );

    let totalQuantityToProduce = 0;
    let totalProducedQuantity = 0;
    let totalDefectQuantity = 0;
    productPlan.purchaseOrder.forEach((purchaseOrder: any) => {
      const [
        totalImportQuantity,
        totalFailImportQuantity,
        totalQuantityToImport,
        totalPoDelivery,
        totalFinishedPoDelivery,
        totalInProgressPoDelivery,
        totalCancelledPoDelivery,
        totalPendingPoDelivery,
      ] = getPurchaseOrderStatistic(purchaseOrder);

      purchaseOrder.totalImportQuantity = totalImportQuantity;
      purchaseOrder.totalFailImportQuantity = totalFailImportQuantity;
      purchaseOrder.totalQuantityToImport = totalQuantityToImport;
      purchaseOrder.totalPoDelivery = totalPoDelivery;
      purchaseOrder.totalFinishedPoDelivery = totalFinishedPoDelivery;
      purchaseOrder.totalInProgressPoDelivery = totalInProgressPoDelivery;
      purchaseOrder.totalCancelledPoDelivery = totalCancelledPoDelivery;
      purchaseOrder.totalPendingPoDelivery = totalPendingPoDelivery;
    });
    
    productPlan.productionPlanDetail.forEach((detail) => {
      totalQuantityToProduce += detail.quantityToProduce;
    });
    productPlan.totalQuantityToProduce = totalQuantityToProduce;
    productPlan.productionPlanDetail.forEach((detail) => {
      if (detail?.productionBatch) {
        detail.productionBatch.forEach((batch) => {
          // if (batch.status === ProductionStatus.FINISHED) {
          batch.importRequest.forEach((request) => {
            request.inspectionRequest.forEach((inspection) => {
              inspection.inspectionReport?.importReceipt.productReceipt.forEach(
                (productReceipt) => {
                  if (productReceipt.isDefect) {
                    totalDefectQuantity += productReceipt.quantityByUom;
                  } else {
                    totalProducedQuantity += productReceipt.quantityByUom;
                  }
                },
              );
            });
          });
          // }
        });
      }
    });

    productPlan.totalProducedQuantity = totalProducedQuantity;
    productPlan.totalDefectQuantity = totalDefectQuantity;

    return apiSuccess(
      HttpStatus.OK,
      productPlan,
      'Get product plan successfully',
    );
  }

  update(id: number, updateProductPlanDto: UpdateProductPlanDto) {
    return `This action updates a #${id} productPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} productPlan`;
  }
}
