import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InventoryReportStatus, Prisma, PrismaClient } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { getPageMeta } from 'src/common/utils/utils';
import { CreateInventoryReportDetailDto } from '../inventory-report-detail/dto/create-inventory-report-detail.dto';
import { WarehouseManagerQuantityReportDetails } from '../inventory-report-detail/dto/warehouse-manager-quantity-report.dto';
import { WarehouseStaffQuantityReportDetails } from '../inventory-report-detail/dto/warehouse-staff-quantity-report.dto';
import { InventoryReportDetailService } from '../inventory-report-detail/inventory-report-detail.service';
import { InventoryReportPlanDto } from '../inventory-report-plan/dto/inventory-report-plan.dto';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { ProductReceiptService } from '../product-receipt/product-receipt.service';
import { TaskService } from '../task/task.service';
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import { UpdateInventoryReportDto } from './dto/update-inventory-report.dto';

@Injectable()
export class InventoryReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly inventoryReportDetailService: InventoryReportDetailService,
    private readonly materialReceiptService: MaterialReceiptService,
    private readonly productReceiptService: ProductReceiptService,
    private readonly taskService: TaskService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  includeQuery: Prisma.InventoryReportInclude = {
    warehouseManager: {
      include: {
        account: true,
      },
    },
    warehouseStaff: {
      include: {
        account: true,
      },
    },
    inventoryReportDetail: {
      include: {
        productReceipt: {
          include: {
            productSize: {
              include: {
                productVariant: {
                  include: {
                    productAttribute: true,
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
        materialReceipt: {
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
                    materialAttribute: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    inventoryReportPlanDetail: {
      include: {
        inventoryReportPlan: true,
      },
    },
  };

  async handleApprovalInventoryReport(
    id: string,
    updateInventoryReportDetailDto: WarehouseManagerQuantityReportDetails,
    warehouseManagerId: string,
  ) {
    const inventoryReport = await this.findById(id);
    if (!inventoryReport) {
      throw new BadRequestException('Inventory report not found');
    }
    if (inventoryReport.status !== InventoryReportStatus.REPORTED) {
      throw new BadRequestException(
        'Inventory report has not been recorded yet',
      );
    }

    const result = await Promise.all(
      updateInventoryReportDetailDto.details.map((inventoryRecordDetail) =>
        this.inventoryReportDetailService.handleApprovalInventoryReportDetail(
          inventoryRecordDetail.inventoryReportDetailId,
          inventoryRecordDetail,
          warehouseManagerId,
        ),
      ),
    );
    const isInventoryReportDetailDone =
      await this.inventoryReportDetailService.checkLastApprovalInventoryReport(
        id,
      );

    if (isInventoryReportDetailDone) {
      await this.updateInventoryReportStatus(
        id,
        InventoryReportStatus.FINISHED,
      );
    }
    //TODO: Fix Bug Check Last Inventory report detail
    const isInventoryPlanDone =
      await this.checkLastApprovalInventoryReport(inventoryReport);

    if (isInventoryPlanDone) {
      await this.prismaService.inventoryReportPlan.update({
        where: {
          id: inventoryReport.inventoryReportPlanDetail[0]
            .inventoryReportPlanId,
        },
        data: {
          status: InventoryReportStatus.FINISHED,
          finishedAt: new Date(),
        },
      });
    }
    // const
    return apiSuccess(
      HttpStatus.OK,
      result,
      'Update inventory report detail successfully',
    );
  }
  async checkLastApprovalInventoryReport(inventoryReport: any) {
    const isLastInventoryReport =
      await this.prismaService.inventoryReport.findMany({
        where: {
          AND: [
            {
              inventoryReportPlanDetail: {
                some: {
                  inventoryReportPlanId:
                    inventoryReport?.inventoryReportPlanDetail[0]
                      .inventoryReportPlanId,
                },
              },
              status: {
                notIn: [InventoryReportStatus.FINISHED],
              },
            },
          ],
        },
      });
    if (isLastInventoryReport.length === 0) {
      return true;
    }
    return false;
  }

  async test(inventoryReportPlanId: string) {
    const isInventoryPlanDone =
      await this.inventoryReportDetailService.checkLastInventoryReport(
        inventoryReportPlanId,
      );
    if (isInventoryPlanDone) {
      await this.prismaService.inventoryReportPlan.update({
        where: {
          id: inventoryReportPlanId,
        },
        data: {
          status: InventoryReportStatus.FINISHED,
          to: new Date(),
        },
      });
    }

    return isInventoryPlanDone;
  }

  async handleRecordInventoryReport(
    id: string,
    updateInventoryReportDetailDto: WarehouseStaffQuantityReportDetails,
    warehouseStaffId: string,
  ): Promise<ApiResponse> {
    const inventoryReport = await this.findById(id);
    if (!inventoryReport) {
      throw new BadRequestException('Inventory report not found');
    }
    const result = await Promise.all(
      updateInventoryReportDetailDto.details.map((inventoryRecordDetail) =>
        this.inventoryReportDetailService.handleRecordInventoryReportDetail(
          inventoryRecordDetail.inventoryReportDetailId,
          inventoryRecordDetail,
          warehouseStaffId,
        ),
      ),
    );
    const isInventoryReportDetailDone =
      await this.inventoryReportDetailService.checkLastInventoryReport(id);

    if (isInventoryReportDetailDone) {
      await this.updateInventoryReportStatus(
        id,
        InventoryReportStatus.REPORTED,
      );

      await this.taskService.updateTaskStatusToDone({
        warehouseStaffId: warehouseStaffId,
        inventoryReportPlanId:
          inventoryReport?.inventoryReportPlanDetail[0].inventoryReportPlanId,
      });
    }
    await this.eventEmitter.emit(
      'notification.inventoryReport.record',
      inventoryReport.id,
    );
    return apiSuccess(
      HttpStatus.OK,
      result,
      'Record inventory report successfully',
    );
  }
  updateInventoryReportStatus(id: string, status: InventoryReportStatus) {
    return this.prismaService.inventoryReport.update({
      where: { id },
      data: {
        status: status,
        ...(status === InventoryReportStatus.FINISHED && { to: new Date() }),
      },
    });
  }

  async findAllByWarehouseStaff(
    findOptions: GeneratedFindOptions<Prisma.InventoryReportWhereInput>,
    warehouseStaffId: string,
  ) {
    const { skip, take, ...rest } = findOptions;
    const page = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.inventoryReport.findMany({
        where: {
          AND: [
            {
              warehouseStaffId,
              ...rest?.where,
            },
          ],
        },
        include: this.includeQuery,
        skip: page,
        take: limit,
        orderBy: findOptions?.orderBy,
      }),
      this.prismaService.inventoryReport.count({
        where: {
          AND: [
            {
              warehouseStaffId,
              ...rest?.where,
            },
          ],
        },
      }),
    ]);
    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'List of Purchase Order',
    );
  }

  async createInventoryReport(
    inventoryReportParam: InventoryReportPlanDto,
    warehouseStaffId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const inventorytReportInput: Prisma.InventoryReportCreateInput = {
      code: undefined,
      from: new Date(),
      note: inventoryReportParam.note,
      warehouseManager: {
        connect: { id: inventoryReportParam.warehouseManagerId },
      },
      warehouseStaff: {
        connect: { id: warehouseStaffId },
      },
    };

    const inventoryReport = await prismaInstance.inventoryReport.create({
      data: inventorytReportInput,
      include: {
        inventoryReportDetail: true,
      },
    });

    if (!inventoryReport) {
      throw new Error('Inventory Report created failed');
    }

    const createInventoryReportDetailDto: CreateInventoryReportDetailDto[] = [];
    const receipt = {
      materialReceipt: [],
      productReceipt: [],
    };

    await Promise.all(
      inventoryReportParam.inventoryReportPlanDetail.map(async (el) => {
        if (el.materialVariantId) {
          const materialReceipt =
            await this.materialReceiptService.getAllMaterialReceiptOfMaterialVariant(
              el.materialVariantId,
            );
          if (materialReceipt.length > 0) {
            receipt.materialReceipt.push(...materialReceipt);
          }
        }
        if (el.productVariantId) {
          const productReceipt =
            await this.productReceiptService.getAllProductReceiptOfProductVariant(
              el.productVariantId,
            );
          if (productReceipt.length > 0) {
            receipt.productReceipt.push(...productReceipt);
          }
        }
      }),
    );
    receipt.materialReceipt.forEach((materialReceipt) => {
      createInventoryReportDetailDto.push({
        materialReceiptId: materialReceipt.id,
        expectedQuantity: materialReceipt.remainQuantityByPack,
        inventoryReportId: inventoryReport.id,
        actualQuantity: undefined,
      });
    });
    receipt.productReceipt.forEach((productReceip) => {
      createInventoryReportDetailDto.push({
        productReceiptId: productReceip.id,
        expectedQuantity: productReceip.remainQuantityByUom,
        inventoryReportId: inventoryReport.id,
        actualQuantity: undefined,
      });
    });

    await this.inventoryReportDetailService.create(
      createInventoryReportDetailDto,
      prismaInstance,
    );

    const inventoryReportDetail =
      await prismaInstance.inventoryReportDetail.findMany({
        where: { inventoryReportId: inventoryReport.id },
      });

    if (!inventoryReportDetail) {
      throw new Error('Inventory Report Detail created failed');
    }

    inventoryReport.inventoryReportDetail = inventoryReportDetail;

    return inventoryReport;
  }

  async create(
    createInventoryReportDto: CreateInventoryReportDto,
    managerId: string,
  ) {
    let materialReceipt = [];
    let productReceipt = [];
    if (createInventoryReportDto.materialPackageId) {
      materialReceipt =
        await this.materialReceiptService.getAllMaterialReceiptOfMaterialPackage(
          createInventoryReportDto.materialPackageId,
        );

      if (!materialReceipt) {
        throw new Error('Material Receipt not found');
      }
    }

    //TODO: Product receipt
    if (createInventoryReportDto.productSizeId) {
      // const productReceipt = await this.
    }

    const createInventoryReportDetailDto: CreateInventoryReportDetailDto[] = [];

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaClient) => {
        const createInventoryReportInput: Prisma.InventoryReportCreateInput = {
          code: undefined,
          from: new Date(),
          note: createInventoryReportDto.note,
          warehouseManager: {
            connect: { id: managerId },
          },
          warehouseStaff: {
            connect: { id: createInventoryReportDto.warehouseStaffId },
          },
        };

        const inventoryReport = await prismaInstance.inventoryReport.create({
          data: createInventoryReportInput,
          include: {
            inventoryReportDetail: true,
          },
        });
        if (!inventoryReport) {
          throw new Error('Inventory Report created failed');
        }

        if (materialReceipt.length > 0) {
          materialReceipt.forEach((materialReceipt) => {
            createInventoryReportDetailDto.push({
              materialReceiptId: materialReceipt.id,
              expectedQuantity: materialReceipt.remainQuantityByPack,
              inventoryReportId: inventoryReport.id,
              actualQuantity: undefined,
            });
          });
        }
        if (productReceipt.length > 0) {
          productReceipt.forEach((materialReceipt) => {
            createInventoryReportDetailDto.push({
              // materialReceiptId: materialReceipt.id,
              productReceiptId: materialReceipt.id,
              expectedQuantity: materialReceipt.remainQuantityByPack,
              inventoryReportId: inventoryReport.id,
              actualQuantity: undefined,
            });
          });
        }

        await this.inventoryReportDetailService.create(
          createInventoryReportDetailDto,
          prismaInstance,
        );

        const inventoryReportDetail =
          await prismaInstance.inventoryReportDetail.findMany({
            where: { inventoryReportId: inventoryReport.id },
          });

        if (!inventoryReportDetail) {
          throw new Error('Inventory Report Detail created failed');
        }

        inventoryReport.inventoryReportDetail = inventoryReportDetail;

        if (createInventoryReportDto.inventoryReportPlanDetailId) {
          await prismaInstance.inventoryReportPlanDetail.update({
            where: { id: createInventoryReportDto.inventoryReportPlanDetailId },
            data: {
              inventoryReport: {
                connect: { id: inventoryReport.id },
              },
            },
          });
        }

        return inventoryReport;
      },
    );

    if (!result) {
      throw new Error('Inventory Report created failed');
    }

    return apiSuccess(
      HttpStatus.CREATED,
      result,
      'Inventory report created successfully',
    );
  }

  async findAll(
    findOptions: GeneratedFindOptions<Prisma.InventoryReportWhereInput>,
  ) {
    const { skip, take, ...rest } = findOptions;
    const page = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.inventoryReport.findMany({
        where: rest?.where,
        include: this.includeQuery,
        skip: page,
        take: limit,
        orderBy: findOptions?.orderBy,
      }) as any,
      this.prismaService.inventoryReport.count({
        where: rest?.where,
      }),
    ]);

    result.forEach((item) => {
      item.totalExpectedQuantity = item.inventoryReportDetail.reduce(
        (sum, detail) => sum + detail.expectedQuantity,
        0,
      );
      item.totalActualQuantity = item.inventoryReportDetail.reduce(
        (sum, detail) => sum + detail.actualQuantity,
        0,
      );
      item.totalManagerQuantityConfirm = item.inventoryReportDetail.reduce(
        (sum, detail) => sum + detail.managerQuantityConfirm,
        0,
      );
    });

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'Get all inventory report successfully',
    );
  }

  async findOne(id: string) {
    const result: any = await this.prismaService.inventoryReport.findUnique({
      where: { id },
      include: {
        warehouseManager: {
          include: {
            account: true,
          },
        },
        warehouseStaff: {
          include: {
            account: true,
          },
        },
        inventoryReportDetail: {
          include: {
            productReceipt: {
              include: {
                productSize: {
                  include: {
                    productVariant: {
                      include: {
                        productAttribute: true,
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
            materialReceipt: {
              include: {
                materialPackage: {
                  include: {
                    materialVariant: {
                      include: {
                        material: true,
                        // materialAttribute: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        inventoryReportPlanDetail: {
          include: {
            inventoryReportPlan: true,
          },
        },
      },
    });

    const groupByMaterialVariant = result.inventoryReportDetail.reduce(
      (acc, current) => {
        if (current.materialReceipt) {
          const materialVariantId =
            current.materialReceipt?.materialPackage?.materialVariant?.id;
          if (materialVariantId) {
            if (!acc[materialVariantId]) {
              acc[materialVariantId] = {
                materialVariant:
                  current.materialReceipt?.materialPackage.materialVariant,
                materialPackages: {},
                totalExpectedQuantity: 0,
                totalActualQuantity: 0,
                totalManagerQuantityConfirm: 0,
              };
            }
            const materialPackageId =
              current.materialReceipt?.materialPackage?.id;
            if (materialPackageId) {
              if (!acc[materialVariantId].materialPackages[materialPackageId]) {
                //Exclude materialVariant from materialPackage
                const { materialVariant, ...materialPackageWithoutVariant } =
                  current.materialReceipt?.materialPackage;
                acc[materialVariantId].materialPackages[materialPackageId] = {
                  materialPackage: materialPackageWithoutVariant,
                  inventoryReportDetails: [],
                  totalExpectedQuantity: 0,
                  totalActualQuantity: 0,
                  totalManagerQuantityConfirm: 0,
                };
              }

              const { materialPackage, ...currentWithoutMaterialPackage } =
                current.materialReceipt;

              acc[materialVariantId].materialPackages[
                materialPackageId
              ].inventoryReportDetails.push({
                id: current.id,
                expectedQuantity: current.expectedQuantity,
                actualQuantity: current.actualQuantity,
                managerQuantityConfirm: current.managerQuantityConfirm,
                materialReceipt: currentWithoutMaterialPackage,
              });
              acc[materialVariantId].materialPackages[
                materialPackageId
              ].totalExpectedQuantity += current.expectedQuantity || 0;
              acc[materialVariantId].materialPackages[
                materialPackageId
              ].totalActualQuantity += current.actualQuantity || 0;
              acc[materialVariantId].materialPackages[
                materialPackageId
              ].totalManagerQuantityConfirm +=
                current.managerQuantityConfirm || 0;
            }

            acc[materialVariantId].totalExpectedQuantity +=
              current.expectedQuantity || 0;
            acc[materialVariantId].totalActualQuantity +=
              current.actualQuantity || 0;
            acc[materialVariantId].totalManagerQuantityConfirm +=
              current.managerQuantityConfirm || 0;
          }
          return acc;
        }
        if (current.productReceipt) {
          const productVariantId =
            current.productReceipt.productSize.productVariant.id;
          if (productVariantId) {
            if (!acc[productVariantId]) {
              acc[productVariantId] = {
                productVariant:
                  current.productReceipt.productSize.productVariant,
                productSizes: {},
                totalExpectedQuantity: 0,
                totalActualQuantity: 0,
                totalManagerQuantityConfirm: 0,
              };
            }
            const productSizeId = current.productReceipt.productSize.id;
            if (productSizeId) {
              if (!acc[productVariantId].productSizes[productSizeId]) {
                //Exclude materialVariant from materialPackage
                const { productVariant, ...productPackageWithoutVariant } =
                  current.productReceipt.productSize;
                acc[productVariantId].productSizes[productSizeId] = {
                  productSize: productPackageWithoutVariant,
                  inventoryReportDetails: [],
                  totalExpectedQuantity: 0,
                  totalActualQuantity: 0,
                  totalManagerQuantityConfirm: 0,
                };
              }
              const { productSize, ...currentWithoutProductPackage } =
                current.productReceipt;
              acc[productVariantId].productSizes[
                productSizeId
              ].inventoryReportDetails.push({
                id: current.id,
                expectedQuantity: current.expectedQuantity,
                actualQuantity: current.actualQuantity,
                managerQuantityConfirm: current.managerQuantityConfirm,
                productReceipt: currentWithoutProductPackage,
              });
              acc[productVariantId].productSizes[
                productSizeId
              ].totalExpectedQuantity += current.expectedQuantity || 0;
              acc[productVariantId].productSizes[
                productSizeId
              ].totalActualQuantity += current.actualQuantity || 0;
              acc[productVariantId].productSizes[
                productSizeId
              ].totalManagerQuantityConfirm +=
                current.managerQuantityConfirm || 0;
            }

            acc[productVariantId].totalExpectedQuantity +=
              current.expectedQuantity || 0;
            acc[productVariantId].totalActualQuantity +=
              current.actualQuantity || 0;
            acc[productVariantId].totalManagerQuantityConfirm +=
              current.managerQuantityConfirm || 0;
          }
          return acc;
        }
      },
      {} as Record<
        string,
        {
          materialVariant?: any;
          productVariant?: any;
          totalExpectedQuantity: 0;
          totalActualQuantity: 0;
          totalManagerQuantityConfirm: 0;
          productSizes?: Record<
            string,
            {
              productSize?: any;
              totalExpectedQuantity: 0;
              totalActualQuantity: 0;
              totalManagerQuantityConfirm: 0;
              inventoryReportDetails?: Array<{
                id: string;
                expectedQuantity: number;
                actualQuantity: number;
                managerQuantityConfirm: number;
                productReceipt: any;
              }>;
            }
          >;
          materialPackages?: Record<
            string,
            {
              materialPackage?: any;
              productSizes?: any;
              totalExpectedQuantity: 0;
              totalActualQuantity: 0;
              totalManagerQuantityConfirm: 0;
              inventoryReportDetails: Array<{
                id: string;
                expectedQuantity: number;
                actualQuantity: number;
                managerQuantityConfirm: number;
                materialReceipt: any;
              }>;
            }
          >;
        }
      >,
    );

    const totalQuantities: any = Object.values(groupByMaterialVariant).reduce(
      (totals: any, variant: any) => {
        totals.totalExpectedQuantity += variant.totalExpectedQuantity;
        totals.totalActualQuantity += variant.totalActualQuantity;
        totals.totalManagerQuantityConfirm +=
          variant.totalManagerQuantityConfirm;
        return totals;
      },
      {
        totalExpectedQuantity: 0,
        totalActualQuantity: 0,
        totalManagerQuantityConfirm: 0,
      },
    );

    result.totalExpectedQuantity = totalQuantities.totalExpectedQuantity;
    result.totalActualQuantity = totalQuantities.totalActualQuantity;
    result.totalManagerQuantityConfirm =
      totalQuantities.totalManagerQuantityConfirm;

    result.inventoryReportDetail = Object.values(groupByMaterialVariant).map(
      (variant: any) => ({
        ...variant,
        materialPackages: variant?.materialPackages
          ? Object.values(variant.materialPackages)
          : undefined,
        productSizes: variant?.productSizes
          ? Object.values(variant.productSizes)
          : undefined,
      }),
    );

    return apiSuccess(
      HttpStatus.OK,
      result,
      'Get inventory report successfully',
    );
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Id is not valid');
    }
    const result = await this.prismaService.inventoryReport.findUnique({
      where: { id },
      include: this.includeQuery,
    });
    return result;
  }

  async update(id: string, updateInventoryReportDto: UpdateInventoryReportDto) {
    return `This action updates a #${id} inventoryReport`;
  }

  async updateStatus(id: string, status: InventoryReportStatus) {
    const inventoryReport = await this.findById(id);

    if (!inventoryReport) {
      throw new BadRequestException('Inventory Report not found');
    }
    const result = await this.prismaService.inventoryReport.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async checkLastInventoryReport(inventoryReportPlanId: string) {
    const inventoryReport = await this.prismaService.inventoryReport.findMany({
      where: {
        inventoryReportPlanDetail: {
          some: {
            inventoryReportPlanId,
          },
        },
        status: {
          notIn: [InventoryReportStatus.FINISHED],
        },
      },
    });
    if (inventoryReport.length > 0) {
      return false;
    }
    return true;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryReport`;
  }
}
