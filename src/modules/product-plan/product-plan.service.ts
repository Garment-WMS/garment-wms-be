import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
  ProductionBatchStatus,
  ProductionStatus,
  ProductSize,
  PurchaseOrderStatus,
} from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { getPageMeta, getPurchaseOrderStatistic } from 'src/common/utils/utils';
import { ExcelService } from '../excel/excel.service';
import { ProductPlanDetailService } from '../product-plan-detail/product-plan-detail.service';
import { totalProductSizeProduced } from '../production-batch/production-batch.service';
import { CreateProductPlanDto } from './dto/create-product-plan.dto';
import { UpdateProductPlanDto } from './dto/update-product-plan.dto';

type importedProductSizeBatch = {
  productSize: ProductSize;
  producedQuantt;
};
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
                            productReceipt: {
                              include: {
                                productSize: {
                                  include: {
                                    productVariant: true,
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

  async findChart(id: string) {
    const productPlan = await this.prismaService.productionPlan.findFirst({
      where: { id },
      include: {
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
                                productReceipt: {
                                  include: {
                                    productSize: {
                                      include: {
                                        productVariant: true,
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
    });
    if (!productPlan) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Product plan not found');
    }
    let totalProductVariantProduced: totalProductSizeProduced[] = [];
    productPlan.productionPlanDetail.forEach((detail: any) => {
      let numberOfDefectProduct = 0;
      let totalProducedProduct = 0;
      let manufacturingProduct = 0;
      let importedBatch = 0;
      let manufacturingBatch = 0;
      detail.productionBatch.forEach((batch) => {
        if (batch.status === ProductionBatchStatus.MANUFACTURING) {
          manufacturingBatch++;
          manufacturingProduct += batch.quantityToProduce;
        } else if (batch.status === ProductionBatchStatus.FINISHED) {
          importedBatch++;
          batch.importRequest.forEach((request) => {
            request.inspectionRequest.forEach((inspectionRequest) => {
              if (inspectionRequest.inspectionReport) {
                if (
                  inspectionRequest.inspectionReport?.importReceipt &&
                  inspectionRequest.inspectionReport.importReceipt.status ===
                    'IMPORTED'
                ) {
                  inspectionRequest.inspectionReport.importReceipt.productReceipt.forEach(
                    (productReceipt) => {
                      totalProductVariantProduced.push({
                        productVariant:
                          productReceipt.productSize.productVariant,
                        producedQuantity: productReceipt.quantityByUom,
                        defectQuantity: productReceipt.isDefect
                          ? productReceipt.quantityByUom
                          : 0,
                      });
                      if (productReceipt.isDefect) {
                        numberOfDefectProduct += productReceipt.quantityByUom;
                        // totalDefectProduct += productReceipt.quantityByUom;
                      } else {
                        totalProducedProduct += productReceipt.quantityByUom;
                        // numberOfProducedProduct += productReceipt.quantityByUom;
                      }
                    },
                  );
                }
              }
            });
          });
        }
      });
      detail.totalProductionBatch = detail.productionBatch.length;
      detail.manufacturingProductionBatch = manufacturingBatch;
      detail.finishedProductionBatch = importedBatch;
      detail.manufacturingProduct = manufacturingProduct;
      detail.totalProducedProduct = totalProducedProduct;
      detail.numberOfDefectProduct = numberOfDefectProduct;
    });
    return apiSuccess(HttpStatus.OK, productPlan, 'Product plan chart');
  }

  async findChartWithProductPlan(productPlan: any) {
    let totalProductVariantProduced: totalProductSizeProduced[] = [];
    productPlan.productionPlanDetail.forEach((detail: any) => {
      let numberOfDefectProduct = 0;
      let totalProducedProduct = 0;
      let manufacturingProduct = 0;
      let importedBatch = 0;
      let manufacturingBatch = 0;
      detail.productionBatch.forEach((batch) => {
        if (batch.status === ProductionBatchStatus.MANUFACTURING) {
          manufacturingBatch++;
          manufacturingProduct += batch.quantityToProduce;
        } else if (batch.status === ProductionBatchStatus.FINISHED) {
          importedBatch++;
          batch.importRequest.forEach((request) => {
            request.inspectionRequest.forEach((inspectionRequest) => {
              if (inspectionRequest.inspectionReport) {
                if (
                  inspectionRequest.inspectionReport?.importReceipt &&
                  inspectionRequest.inspectionReport.importReceipt.status ===
                    'IMPORTED'
                ) {
                  inspectionRequest.inspectionReport.importReceipt.productReceipt.forEach(
                    (productReceipt) => {
                      totalProductVariantProduced.push({
                        productVariant:
                          productReceipt.productSize.productVariant,
                        producedQuantity: productReceipt.quantityByUom,
                        defectQuantity: productReceipt.isDefect
                          ? productReceipt.quantityByUom
                          : 0,
                      });
                      if (productReceipt.isDefect) {
                        numberOfDefectProduct += productReceipt.quantityByUom;
                        // totalDefectProduct += productReceipt.quantityByUom;
                      } else {
                        totalProducedProduct += productReceipt.quantityByUom;
                        // numberOfProducedProduct += productReceipt.quantityByUom;
                      }
                    },
                  );
                }
              }
            });
          });
        }
      });
      detail.totalProductionBatch = detail.productionBatch.length;
      detail.manufacturingProductionBatch = manufacturingBatch;
      detail.finishedProductionBatch = importedBatch;
      detail.manufacturingProduct = manufacturingProduct;
      detail.totalProducedProduct = totalProducedProduct;
      detail.numberOfDefectProduct = numberOfDefectProduct;
    });
    productPlan.totalProductVariantProduced = totalProductVariantProduced;
    return productPlan;
    // return apiSuccess(HttpStatus.OK, productPlan, 'Product plan chart');
  }

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
        orderBy: filterOption?.orderBy,
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
      getProductPlanStatistics(productionPlan);
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
      // this.findChartWithProductPlan(productionPlan);
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
              // purchasingStaff: {
              //   include: {
              //     account: true,
              //   },
              // },
              // supplier: true,
              poDelivery: {
                include: {
                  importRequest: true,
                  poDeliveryDetail: {
                    include: {
                      materialPackage: {
                        include: {
                          materialVariant: true,
                          // {
                          // include: {
                          //   material: {
                          //     include: {
                          //       materialUom: true,
                          //     },
                          //   },
                          // },
                          // },
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
                  productVariant: true,
                  // {
                  //   include: {
                  //     product: {
                  //       include: {
                  //         productUom: true,
                  //       },
                  //     },
                  //   },
                  // },
                },
              },
            },
          },
        },
      },
    );

    getProductPlanStatistics(productPlan);
    // this.findChartWithProductPlan(productPlan);

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

function getProductPlanStatistics(productPlan: any) {
  let totalQuantityToProduce = 0;
  let totalProducedQuantity = 0;
  let totalDefectQuantity = 0;
  let totalManufacturingQuantity = 0;
  let totalCancelledBatch = 0;
  let totalPendingBatch = 0;
  let totalImportingBatch = 0;
  // let totalPendingPurchaseOrder = 0;
  let totalInProgressPurchaseOrder = 0;
  let totalFinishedPurchaseOrder = 0;
  let totalCancelledPurchaseOrder = 0;

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

    if (purchaseOrder.status === PurchaseOrderStatus.IN_PROGRESS) {
      totalInProgressPurchaseOrder++;
    }
    if (purchaseOrder.status === PurchaseOrderStatus.FINISHED) {
      totalFinishedPurchaseOrder++;
    }
    if (purchaseOrder.status === PurchaseOrderStatus.CANCELLED) {
      totalCancelledPurchaseOrder++;
    }

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
    let productPlanDetailDefectQuantity = 0;
    let productPlanDetailProducedQuantity = 0;
    let productPlanDetailManufacturingQuantity = 0;
    let productPlanDetailImportingQuantity = 0;
    let productPlanDetailCancelledBatch = 0;
    let productPlanDetailPendingBatch = 0;
    let importedBatch = 0;
    let manufacturingBatch = 0;
    let canceledBatch = 0;
    let pendingBatch = 0;
    let importingBatch = 0;
    if (detail?.productionBatch) {
      detail.productionBatch.forEach((batch) => {
        // if (batch.status === ProductionStatus.FINISHED) {
        batch.importRequest.forEach((request) => {
          request.inspectionRequest.forEach((inspection) => {
            inspection.inspectionReport?.importReceipt?.productReceipt.forEach(
              (productReceipt) => {
                if (batch.status === ProductionBatchStatus.MANUFACTURING) {
                  manufacturingBatch++;
                  productPlanDetailManufacturingQuantity +=
                    batch.quantityToProduce;
                  totalManufacturingQuantity += batch.quantityToProduce;
                } else if (batch.status === ProductionBatchStatus.FINISHED) {
                  importedBatch++;
                  batch.importRequest.forEach((request) => {
                    request.inspectionRequest.forEach((inspectionRequest) => {
                      if (inspectionRequest.inspectionReport) {
                        if (
                          inspectionRequest.inspectionReport?.importReceipt &&
                          inspectionRequest.inspectionReport.importReceipt
                            .status === 'IMPORTED'
                        ) {
                          inspectionRequest.inspectionReport.importReceipt.productReceipt.forEach(
                            (productReceipt) => {
                              if (productReceipt.isDefect) {
                                productPlanDetailDefectQuantity +=
                                  productReceipt.quantityByUom;
                                totalDefectQuantity +=
                                  productReceipt.quantityByUom;
                                // totalDefectProduct += productReceipt.quantityByUom;
                              } else {
                                productPlanDetailProducedQuantity +=
                                  productReceipt.quantityByUom;
                                totalProducedQuantity +=
                                  productReceipt.quantityByUom;
                                // numberOfProducedProduct += productReceipt.quantityByUom;
                              }
                            },
                          );
                        }
                      }
                    });
                  });
                } else if (batch.status === ProductionBatchStatus.CANCELLED) {
                  canceledBatch++;
                  productPlanDetailCancelledBatch += batch.quantityToProduce;
                } else if (batch.status === ProductionBatchStatus.PENDING) {
                  pendingBatch++;
                  productPlanDetailPendingBatch += batch.quantityToProduce;
                  totalPendingBatch += batch.quantityToProduce;
                } else if (batch.status === ProductionBatchStatus.IMPORTING) {
                  importingBatch++;
                  productPlanDetailImportingQuantity += batch.quantityToProduce;
                  totalImportingBatch += batch.quantityToProduce;
                }
              },
            );
          });
        });
        // }
      });
    }
    detail.productPlanDetailManufacturingQuantity =
      productPlanDetailManufacturingQuantity;
    detail.productPlanDetailDefectQuantity = productPlanDetailDefectQuantity;
    detail.productPlanDetailProducedQuantity =
      productPlanDetailProducedQuantity;
    detail.productPlanDetailImportingQuantity =
      productPlanDetailImportingQuantity;
    detail.productPlanDetailCancelledBatch = productPlanDetailCancelledBatch;
    detail.productPlanDetailPendingBatch = productPlanDetailPendingBatch;
    detail.importedBatch = importedBatch;
    detail.manufacturingBatch = manufacturingBatch;
    detail.canceledBatch = canceledBatch;
    detail.pendingBatch = pendingBatch;
    detail.importingBatch = importingBatch;
  });
  productPlan.totalProducedQuantity = totalProducedQuantity;
  productPlan.totalDefectQuantity = totalDefectQuantity;
  productPlan.totalManufacturingQuantity = totalManufacturingQuantity;
  productPlan.totalCancelledBatch = totalCancelledBatch;
  productPlan.totalPendingBatch = totalPendingBatch;
  productPlan.totalImportingBatch = totalImportingBatch;
  // productPlan.totalPendingPurchaseOrder = totalPendingPurchaseOrder;
  productPlan.totalInProgressPurchaseOrder = totalInProgressPurchaseOrder;
  productPlan.totalFinishedPurchaseOrder = totalFinishedPurchaseOrder;
  productPlan.totalCancelledPurchaseOrder = totalCancelledPurchaseOrder;

  return productPlan;
}
