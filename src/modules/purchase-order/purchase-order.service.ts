import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PoDeliveryStatus, Prisma, PurchaseOrderStatus } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { getPageMeta } from 'src/common/utils/utils';
import { ExcelService } from '../excel/excel.service';
import { ChartDto } from '../material-variant/dto/chart.dto';
import { PoDeliveryDto } from '../po-delivery/dto/po-delivery.dto';
import {
  extractNumberFromCode,
  PoDeliveryService,
} from '../po-delivery/po-delivery.service';
import { ProductPlanService } from '../product-plan/product-plan.service';
import { CancelledPurchaseOrderDto } from './dto/cancelled-purchase-order.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { UpdatePurchaseOrderStatusDto } from './dto/update-purchase-order-status.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly excelService: ExcelService,
    private readonly poDeliveryService: PoDeliveryService,
    private readonly productionPlanservice: ProductPlanService,
  ) {}

  queryInclude: Prisma.PurchaseOrderInclude = {
    supplier: true,
    poDelivery: {
      include: {
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
  };

  async getPurchaseOrderChart(chartDto: ChartDto) {
    const { year } = chartDto;
    const monthlyData = [];
    for (let month = 0; month < 12; month++) {
      const from = new Date(year, month, 1);
      const to = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const purchaseOrder = await this.prismaService.purchaseOrder.findMany({
        where: {
          AND: {
            createdAt: {
              gte: from,
              lte: to,
            },
            status: {
              in: [PurchaseOrderStatus.FINISHED],
            },
          },
        },
        include: {
          poDelivery: {
            include: {
              poDeliveryDetail: true,
            },
          },
        },
      });
      let poValue = 0;
      let numberOfMaterialUnits = 0;
      purchaseOrder.forEach((po) => {
        poValue += po.subTotalAmount;
        po.poDelivery.forEach((pd) => {
          pd.poDeliveryDetail.forEach((pdd) => {
            numberOfMaterialUnits += pdd.quantityByPack;
          });
        });
      });

      //TODO: Need to check if this is correct after doing materialExportReceipt
      // const exportMaterialReceipt =
      //   await this.prismaService.materialExportReceiptDetail.findMany({
      //     where: {
      //       AND: {
      //         ...additionExportReceiptQuery,
      //         createdAt: {
      //           gte: from,
      //           lte: to,
      //         },
      //       },
      //       materialExportReceipt: {
      //         status: ExportReceiptStatus.EXPORTED,
      //       },
      //     },
      //     include: {
      //       materialReceipt: {
      //         include: {
      //           materialPackage: {
      //             include: materialPackageInclude,
      //           },
      //         },
      //       },
      //     },
      //   });

      // const totalQuantities = this.calculateTotalQuantities(
      //   importMaterialReceipt,
      //   exportMaterialReceipt,
      // );
      monthlyData.push({
        month: month + 1,
        data: {
          numberOfImportedMaterialUnits: numberOfMaterialUnits,
          numberOfPo: purchaseOrder.length,
          poValue,
        },
      });
    }

    return apiSuccess(HttpStatus.OK, monthlyData, 'Purchase Order chart data');
  }

  async getPurchaseOrderStatisticsHistory(from: any, to: any) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const allPurchaseOrder = await this.prismaService.purchaseOrder.findMany({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });
    let total = allPurchaseOrder.reduce(
      (total, order) => total + order.subTotalAmount,
      0,
    );
  }
  async updateAllPurchaseOrderCodes(): Promise<ApiResponse> {
    try {
      const purchaseOrders = await this.prismaService.purchaseOrder.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });

      let updatedCount = 0;
      for (let i = 0; i < purchaseOrders.length; i++) {
        const po = purchaseOrders[i];
        const newCode = this.generatePurchaseOrderCode(i + 1);

        await this.prismaService.purchaseOrder.update({
          where: { id: po.id },
          data: { poNumber: newCode },
        });

        updatedCount++;
      }

      return apiSuccess(
        HttpStatus.OK,
        { updatedCount },
        `Successfully updated ${updatedCount} purchase order codes.`,
      );
    } catch (error) {
      console.error('Error updating purchase order codes:', error);
      return apiFailed(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An error occurred while updating purchase order codes.',
      );
    }
  }

  private generatePurchaseOrderCode(number: number): string {
    const prefix = 'PUR-ORD';
    const paddedNumber = number.toString().padStart(6, '0');
    return `${prefix}-${paddedNumber}`;
  }
  async getAllPurchaseOrders() {
    const result = (await this.prismaService.purchaseOrder.findMany({
      include: {
        purchasingStaff: {
          include: {
            account: true,
          },
        },
        productionPlan: true,
        supplier: true,
        poDelivery: {
          include: {
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
    })) as any;

    for (const purchaseOrder of result) {
      const [
        totalImportQuantity,
        totalFailImportQuantity,
        totalQuantityToImport,
        totalPoDelivery,
        totalFinishedPoDelivery,
        totalInProgressPoDelivery,
        totalCancelledPoDelivery,
        totalPendingPoDelivery,
      ] = await this.getPurchaseOrderStatistic(purchaseOrder, purchaseOrder.id);

      purchaseOrder.totalImportQuantity = totalImportQuantity;
      purchaseOrder.totalFailImportQuantity = totalFailImportQuantity;
      purchaseOrder.totalQuantityToImport = totalQuantityToImport;
      purchaseOrder.totalPoDelivery = totalPoDelivery;
      purchaseOrder.totalFinishedPoDelivery = totalFinishedPoDelivery;
      purchaseOrder.totalInProgressPoDelivery = totalInProgressPoDelivery;
      purchaseOrder.totalCancelledPoDelivery = totalCancelledPoDelivery;
      purchaseOrder.totalPendingPoDelivery = totalPendingPoDelivery;
    }

    return apiSuccess(
      HttpStatus.OK,
      result,
      'List of Purchase Order retrieved successfully',
    );
  }

  async cancelledPurchaseOrder(
    id: string,
    cancelPurchaseOrder: CancelledPurchaseOrderDto,
    purchasingStaffId: string,
  ) {
    const purchaseOrder = await this.findById(id);
    if (!purchaseOrder) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    if (purchaseOrder.status !== PurchaseOrderStatus.IN_PROGRESS) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Purchase Order status is finished or cancelled, you cannot update the status',
      );
    }

    //Check if there are any importing PoDelivery
    const poDeliveries =
      await this.poDeliveryService.IsImportingOrFinishedPoDeliveryExist(id);

    if (poDeliveries) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'There are Po Deliveries that are importing or finished, you cannot cancel the Purchase Order',
      );
    }

    const result = await this.prismaService.$transaction(async (prisma) => {
      await this.poDeliveryService.updatePoDeliveryMaterialStatusByPoId(
        prisma,
        id,
        PurchaseOrderStatus.CANCELLED,
      );

      const result = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: PurchaseOrderStatus.CANCELLED,
          cancelledReason: cancelPurchaseOrder.cancelledReason,
          cancelledBy: purchasingStaffId,
          cancelledAt: new Date(),
        },
      });
      return result;
    });

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Purchase Order cancelled');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to cancel Purchase Order');
  }
  async getPurchaseOrderStatistics() {
    const [total, inProgress, finished, cancelled] =
      await this.prismaService.$transaction([
        this.prismaService.purchaseOrder.count(),
        this.prismaService.purchaseOrder.count({
          where: { status: PurchaseOrderStatus.IN_PROGRESS },
        }),
        this.prismaService.purchaseOrder.count({
          where: { status: PurchaseOrderStatus.FINISHED },
        }),
        this.prismaService.purchaseOrder.count({
          where: { status: PurchaseOrderStatus.CANCELLED },
        }),
      ]);

    return apiSuccess(
      HttpStatus.OK,
      {
        total,
        inProgress,
        finished,
        cancelled,
      },
      'Purchase Order statistics',
    );
  }

  async getPurchaseOrderStatus() {
    return apiSuccess(
      HttpStatus.OK,
      Object.values(PurchaseOrderStatus),
      'List of Purchase Order Status',
    );
  }

  async deletePurchaseOrder(id: string) {
    try {
      await this.prismaService.purchaseOrder.delete({
        where: { id },
      });
    } catch (e) {
      console.log(e);
    }
    return apiSuccess(
      HttpStatus.OK,
      null,
      'Purchase Order deleted successfully',
    );
  }

  async getPurchaseOrders(
    filterOption?: GeneratedFindOptions<Prisma.PurchaseOrderWhereInput>,
  ) {
    const { skip, take, ...rest } = filterOption;
    const page = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;
    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.purchaseOrder.findMany({
        skip: page,
        take: limit,
        where: {
          ...rest?.where,
        },
        orderBy: filterOption?.orderBy,
        include: {
          purchasingStaff: {
            include: {
              account: true,
            },
          },
          productionPlan: true,
          supplier: true,
          poDelivery: {
            include: {
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
      }) as any,
      this.prismaService.purchaseOrder.count({
        where: filterOption?.where ? filterOption.where : undefined,
      }),
    ]);
    for (const purchaseOrder of result) {
      const [
        totalImportQuantity,
        totalFailImportQuantity,
        totalQuantityToImport,
        totalPoDelivery,
        totalFinishedPoDelivery,
        totalInProgressPoDelivery,
        totalCancelledPoDelivery,
        totalPendingPoDelivery,
      ] = await this.getPurchaseOrderStatistic(purchaseOrder, purchaseOrder.id);

      purchaseOrder.totalImportQuantity = totalImportQuantity;
      purchaseOrder.totalFailImportQuantity = totalFailImportQuantity;
      purchaseOrder.totalQuantityToImport = totalQuantityToImport;
      purchaseOrder.totalPoDelivery = totalPoDelivery;
      purchaseOrder.totalFinishedPoDelivery = totalFinishedPoDelivery;
      purchaseOrder.totalInProgressPoDelivery = totalInProgressPoDelivery;
      purchaseOrder.totalCancelledPoDelivery = totalCancelledPoDelivery;
      purchaseOrder.totalPendingPoDelivery = totalPendingPoDelivery;
    }

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'List of Purchase Order',
    );
  }

  async createPurchaseOrder(purchaseOrderDto: PurchaseOrderDto) {
    return this.prismaService.purchaseOrder.create({
      data: purchaseOrderDto,
    });
  }
  async findByIdWithResponse(id: string) {
    const purchaseOrder: any = await this.findById(id);
    if (!purchaseOrder) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    const [
      totalImportQuantity,
      totalFailImportQuantity,
      totalQuantityToImport,
      totalPoDelivery,
      totalFinishedPoDelivery,
      totalInProgressPoDelivery,
      totalCancelledPoDelivery,
      totalPendingPoDelivery,
    ] = await this.getPurchaseOrderStatistic(purchaseOrder, id);

    purchaseOrder.totalImportQuantity = totalImportQuantity;
    purchaseOrder.totalFailImportQuantity = totalFailImportQuantity;
    purchaseOrder.totalQuantityToImport = totalQuantityToImport;
    purchaseOrder.totalPoDelivery = totalPoDelivery;
    purchaseOrder.totalFinishedPoDelivery = totalFinishedPoDelivery;
    purchaseOrder.totalInProgressPoDelivery = totalInProgressPoDelivery;
    purchaseOrder.totalCancelledPoDelivery = totalCancelledPoDelivery;
    purchaseOrder.totalPendingPoDelivery = totalPendingPoDelivery;
    purchaseOrder.poMaterialSummary = getPoDeliveryStatistic(
      purchaseOrder.poDelivery,
    );
    // Return success response with data
    return apiSuccess(
      HttpStatus.OK,
      purchaseOrder,
      'Purchase Order retrieved successfully',
    );
  }

  async getPurchaseOrderStatistic(purchaseOrder, id: string) {
    let totalImportQuantity = 0;
    let totalQuantityToImport = 0;
    let totalFailImportQuantity = 0;
    let totalAwaitToImportQuantity = 0;

    const poDeliveryStats = purchaseOrder.poDelivery.reduce(
      (acc, poDelivery) => {
        // console.log( acc.totalPoDelivery++);
        acc.totalPoDelivery++;

        switch (poDelivery.status) {
          case PoDeliveryStatus.FINISHED:
            acc.totalFinishedPoDelivery++;
            break;
          case PoDeliveryStatus.IMPORTING:
            // if (
            //   poDelivery?.importRequest.status ===
            //   ImportRequestStatus.AWAIT_TO_IMPORT
            // ) {
            //   totalAwaitToImportQuantity += poDelivery.poDeliveryDetail.reduce(
            //     (acc, poDeliveryDetail) => {
            //       return acc + poDeliveryDetail.quantityByPack;
            //     },
            //     0,
            //   );
            // }
            acc.totalInProgressPoDelivery++;
            break;
          case PoDeliveryStatus.CANCELLED:
            acc.totalCancelledPoDelivery++;
            break;
          case PoDeliveryStatus.PENDING:
            acc.totalPendingPoDelivery++;
            break;
        }

        poDelivery.poDeliveryDetail.forEach((poDeliveryDetail) => {
          if (
            poDelivery.status === PoDeliveryStatus.FINISHED &&
            !poDelivery.isExtra
          ) {
            totalFailImportQuantity +=
              poDeliveryDetail.quantityByPack -
              poDeliveryDetail.actualImportQuantity;
            totalImportQuantity += poDeliveryDetail.actualImportQuantity;
          }
          if (!poDelivery.isExtra) {
            totalQuantityToImport += poDeliveryDetail.quantityByPack;
          }
        });

        return acc;
      },
      {
        totalPoDelivery: 0,
        totalFinishedPoDelivery: 0,
        totalInProgressPoDelivery: 0,
        totalCancelledPoDelivery: 0,
        totalPendingPoDelivery: 0,
      },
    );

    purchaseOrder.totalImportQuantity = totalImportQuantity;
    purchaseOrder.totalFailImportQuantity = totalFailImportQuantity;
    purchaseOrder.totalQuantityToImport = totalQuantityToImport;

    purchaseOrder.totalPoDelivery = poDeliveryStats.totalPoDelivery;
    purchaseOrder.totalFinishedPoDelivery =
      poDeliveryStats.totalFinishedPoDelivery;
    purchaseOrder.totalInProgressPoDelivery =
      poDeliveryStats.totalInProgressPoDelivery;
    purchaseOrder.totalPendingPoDelivery =
      poDeliveryStats.totalPendingPoDelivery;
    purchaseOrder.totalCancelledPoDelivery =
      poDeliveryStats.totalCancelledPoDelivery;

    return [
      totalImportQuantity,
      totalFailImportQuantity,
      totalQuantityToImport,
      poDeliveryStats.totalPoDelivery,
      poDeliveryStats.totalFinishedPoDelivery,
      poDeliveryStats.totalInProgressPoDelivery,
      poDeliveryStats.totalCancelledPoDelivery,
      poDeliveryStats.totalPendingPoDelivery,
    ];
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    return this.prismaService.purchaseOrder.findUnique({
      where: { id },
      include: {
        purchasingStaff: {
          include: {
            account: true,
          },
        },

        productionPlan: true,
        supplier: true,
        poDelivery: {
          include: {
            importRequest: {
              where: {
                status: {
                  notIn: ['CANCELLED', 'REJECTED'],
                },
              },
              include: {
                inspectionRequest: {
                  include: {
                    inspectionReport: {
                      include: {
                        importReceipt: {
                          include: {
                            materialReceipt: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
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
    });
  }

  async createPurchaseOrderWithExcelFile(
    file: Express.Multer.File,
    purchasingStaffId: string,
    // productionPlanId: string,
  ) {
    const excelData = await this.excelService.readExcel(file);
    let purchaseOrder = null;
    if (excelData instanceof ApiResponse) {
      return excelData;
    } else {
      let subTotalAmount = 0;
      excelData.poDelivery.forEach((poDelivery) => {
        poDelivery.poDeliveryDetail.forEach((material) => {
          subTotalAmount += material.totalAmount;
        });
      });

      // const PoNumber = await this.generateNextPoNumber();
      const createPurchaseOrderData =
        excelData as Partial<CreatePurchaseOrderDto>;

      const productionPlan =
        await this.productionPlanservice.findValidProductionPlan(
          createPurchaseOrderData.productionPlanId,
        );

      if (!productionPlan) {
        return apiFailed(
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          'Invalid Production Plan, the production plan is not available',
        );
      }

      const createPurchaseOrder: Prisma.PurchaseOrderCreateInput = {
        subTotalAmount: subTotalAmount,
        productionPlan: {
          connect: { id: createPurchaseOrderData.productionPlanId },
        },
        taxAmount: createPurchaseOrderData.taxAmount,
        expectedFinishDate: createPurchaseOrderData.expectedFinishDate,
        orderDate: createPurchaseOrderData.orderDate,
        status: PurchaseOrderStatus.IN_PROGRESS,
        supplier: {
          connect: { id: createPurchaseOrderData.Supplier.id },
        },
        currency: 'VND',
        purchasingStaff: {
          connect: { id: purchasingStaffId },
        },
        finishDate: undefined,
        shippingAmount: createPurchaseOrderData.shippingAmount,
        otherAmount: createPurchaseOrderData.otherAmount,
        // poNumber: PoNumber,
      };

      purchaseOrder = await this.prismaService.$transaction(async (prisma) => {
        const purchaseOrder = await prisma.purchaseOrder.create({
          data: createPurchaseOrder,
        });
        if (purchaseOrder) {
          await prisma.purchaseOrder.update({
            where: { id: purchaseOrder.id },
            data: {
              poNumber: purchaseOrder.code,
            },
          });
        }

        let poDeliveryCode = null;
        for (let i = 0; i < excelData.poDelivery.length; i++) {
          const poDelivery: Partial<PoDeliveryDto> = excelData.poDelivery[i];
          // let codeNumber =
          //   await this.poDeliveryService.generateManyNextPoDeliveryCodes(i + 1);
          const poDeliveryCreateInput: Prisma.PoDeliveryCreateInput = {
            isExtra: poDelivery.isExtra,
            purchaseOrder: { connect: { id: purchaseOrder.id } },
            expectedDeliverDate: poDelivery.expectedDeliverDate,
            code: poDeliveryCode ? poDeliveryCode : undefined,
          };
          const poDeliveryResult = await prisma.poDelivery.create({
            data: poDeliveryCreateInput,
          });

          const extractedNumber =
            extractNumberFromCode(poDeliveryResult.code) + 1;
          poDeliveryCode = `PO-DEL-${extractedNumber.toString().padStart(6, '0')}`;
          const poDeliveryDetails = poDelivery.poDeliveryDetail.map(
            (material) => {
              return {
                materialPackageId: material.materialVariantId,
                quantityByPack: material.quantityByPack,
                expiredDate: material.expiredDate,
                totalAmount: material.totalAmount,
                poDeliveryId: poDeliveryResult.id,
              };
            },
          );
          await prisma.poDeliveryDetail.createMany({
            data: poDeliveryDetails,
          });
        }
        return purchaseOrder;
      });
    }
    const result = await this.findById(purchaseOrder?.id);
    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Purchase Order created successfully',
      );
    }
    return apiSuccess(
      HttpStatus.BAD_REQUEST,
      null,
      'Failed to create Purchase Order',
    );
  }

  async updatePurchaseOrder(
    id: string,
    updatedPurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return this.prismaService.purchaseOrder.update({
      where: { id },
      data: updatedPurchaseOrderDto,
    });
  }

  async updatePurchaseOrderStatus(
    id: string,
    updatedPurchaseOrderStatusDto: UpdatePurchaseOrderStatusDto,
  ) {
    let result = null;

    const purchaseOrder = await this.findById(id);

    if (!purchaseOrder) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Purchase Order not found');
    }

    if (purchaseOrder.status !== PurchaseOrderStatus.IN_PROGRESS) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Purchase Order status is finished or cancelled, you cannot update the status',
      );
    }

    if (
      updatedPurchaseOrderStatusDto.status === PurchaseOrderStatus.CANCELLED
    ) {
      result = await this.prismaService.$transaction(async (prisma) => {
        await this.poDeliveryService.updatePoDeliveryMaterialStatusByPoId(
          prisma,
          id,
          PurchaseOrderStatus.CANCELLED,
        );

        await prisma.purchaseOrder.update({
          where: { id },
          data: {
            status: PurchaseOrderStatus.CANCELLED,
          },
        });
      });
      return apiSuccess(HttpStatus.OK, null, 'Purchase Order cancelled');
    }

    if (updatedPurchaseOrderStatusDto.status === PurchaseOrderStatus.FINISHED) {
      result = await this.prismaService.$transaction(async (prisma) => {
        await this.poDeliveryService.updatePoDeliveryMaterialStatusByPoId(
          prisma,
          id,
          PurchaseOrderStatus.FINISHED,
        );

        await prisma.purchaseOrder.update({
          where: { id },
          data: {
            finishDate: new Date(),
            status: PurchaseOrderStatus.FINISHED,
          },
        });
      });
      return apiSuccess(HttpStatus.OK, null, 'Purchase Order finished');
    }

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        await this.findById(id),
        'Purchase Order updated',
      );
    }

    return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid status');
  }

  // async generateNextPoNumber() {
  //   const lastPo: any = await this.prismaService.$queryRaw<
  //     { poNumber: string }[]
  //   >`SELECT "PO_number" FROM "purchase_order" ORDER BY CAST(SUBSTRING("PO_number", 4) AS INT) DESC LIMIT 1`;

  //   const poNumber = lastPo[0]?.PO_number;
  //   let nextCodeNumber = 1;
  //   if (poNumber) {
  //     const currentCodeNumber = parseInt(poNumber.replace(/^PO-?/, ''), 10);
  //     nextCodeNumber = currentCodeNumber + 1;
  //   }

  //   const nextCode = `${Constant.PO_CODE_PREFIX}-${nextCodeNumber.toString().padStart(6, '0')}`;
  //   return nextCode;
  // }
}

export function getPoDeliveryStatistic(poDelivery) {
  if (!poDelivery) {
    return poDelivery;
  }
  const materialSummary = poDelivery.reduce((summary, delivery) => {
    delivery.poDeliveryDetail?.forEach((detail) => {
      const materialId = detail.materialPackageId;
      if (summary[materialId]) {
        summary[materialId].quantityByPack += detail.quantityByPack;
        summary[materialId].actualImportQuantity += detail.actualImportQuantity;
      } else {
        summary[materialId] = {
          ...detail.materialPackage,
          quantityByPack: detail.quantityByPack,
          actualImportQuantity: detail.actualImportQuantity,
        };
      }
    });
    return summary;
  }, {});

  return Object.values(materialSummary);
}
