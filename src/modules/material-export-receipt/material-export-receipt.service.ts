import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { $Enums, ExportReceiptStatus, Prisma, RoleCode } from '@prisma/client';
import {
  materialExportReceiptInclude,
  materialExportRequestInclude,
  materialInclude,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { TaskService } from '../task/task.service';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import { ExportAlgorithmParam } from './dto/export-algorithm-param.type';
import { ExportAlgorithmResults } from './dto/export-algorithm-result.dto';
import {
  ProductionStaffApproveDto,
  ProductionStaffCApproveAction,
} from './dto/production-staff-approve.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';
import {
  WarehouseStaffExportAction,
  WarehouseStaffExportDto,
} from './dto/warehouse-staff-export.dto';
import { ExportAlgorithmEnum } from './enum/export-algorithm.enum';
import { ExportAlgorithmService } from './export-algorithm.service';

@Injectable()
export class MaterialExportReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exportAlgorithmService: ExportAlgorithmService,
    private readonly taskService: TaskService,
  ) {}

  async getByUserToken(
    authenUser: AuthenUser,
    findOptions: GeneratedFindOptions<Prisma.MaterialExportReceiptWhereInput>,
  ) {
    switch (authenUser.role) {
      case RoleCode.WAREHOUSE_STAFF:
        findOptions.where = {
          warehouseStaffId: authenUser.warehouseStaffId,
        };
        return this.search(findOptions);
      default:
        throw new ForbiddenException('This role is not allowed');
    }
  }

  async getByMaterialExportRequestId(materialExportRequestId: string) {
    const materialExportRequest =
      await this.prismaService.materialExportRequest.count({
        where: {
          id: materialExportRequestId,
        },
      });
    if (materialExportRequest === 0) {
      throw new Error('Material export request not found');
    }
    const data = await this.prismaService.materialExportReceipt.findMany({
      where: {
        materialExportRequestId: materialExportRequestId,
      },
      include: materialExportReceiptInclude,
    });
    return data;
  }

  async updateAwaitStatusToExportingStatus() {
    await this.prismaService.materialExportReceipt.updateMany({
      where: {
        status: ExportReceiptStatus.AWAIT_TO_EXPORT,
      },
      data: {
        status: ExportReceiptStatus.EXPORTING,
      },
    });
  }

  async create(createMaterialExportReceiptDto: CreateMaterialExportReceiptDto) {
    const input: Prisma.MaterialExportReceiptUncheckedCreateInput = {
      type: createMaterialExportReceiptDto.type,
      note: createMaterialExportReceiptDto.note,
      warehouseStaffId: createMaterialExportReceiptDto.warehouseStaffId,
      materialExportReceiptDetail: {
        createMany: {
          data: createMaterialExportReceiptDto.materialExportReceiptDetail.map(
            (detail) => ({
              materialReceiptId: detail.materialReceiptId,
              quantityByPack: detail.quantityByPack,
            }),
          ),
          skipDuplicates: true,
        },
      },
    };

    return this.prismaService.materialExportReceipt.create({
      data: input,
      include: materialExportReceiptInclude,
    });
  }

  async getLatest(from: any, to: any) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const importReceipt =
      await this.prismaService.materialExportReceipt.findMany({
        where: {
          createdAt: {
            ...(from ? { gte: fromDate } : {}),
            ...(to ? { lte: toDate } : {}),
          },
        },
        include: materialExportReceiptInclude,
        orderBy: {
          createdAt: 'desc',
        },
      });
    return apiSuccess(
      HttpStatus.OK,
      importReceipt,
      'Get import receipts successfully',
    );
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.MaterialExportReceiptWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialExportReceipt.findMany({
        ...findOptions,
        include: materialExportReceiptInclude,
      }),
      this.prismaService.materialExportReceipt.count({
        where: findOptions?.where,
      }),
    ]);
    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async findUnique(id: string) {
    const materialExportReceipt =
      this.prismaService.materialExportReceipt.findUnique({
        where: { id },
        include: materialExportReceiptInclude,
      });
    if (!materialExportReceipt) {
      throw new Error('Material export receipt not found');
    }
    return materialExportReceipt;
  }

  async getRecommendedMaterialExportReceipt(
    materialExportRequestId: string,
    exportAlgorithmEnum: ExportAlgorithmEnum,
  ) {
    const materialExportRequest =
      await this.prismaService.materialExportRequest.findUnique({
        where: {
          id: materialExportRequestId,
        },
        include: {
          materialExportRequestDetail: {
            include: {
              materialVariant: {
                include: {
                  materialPackage: { include: { materialReceipt: true } },
                },
              },
            },
          },
        },
      });
    if (!materialExportRequest) {
      throw new Error('Material export request not found');
    }

    // const notEnoughMaterialExportRequestDetails = [];
    for (const materialExportRequestDetail of materialExportRequest.materialExportRequestDetail) {
      // const inventoryStockOfAMaterialVariant =
      //   await this.prismaService.inventoryStock.findMany({
      //     where: {
      //       materialPackage: {
      //         materialVariantId: materialExportRequestDetail.materialVariantId,
      //       },
      //     },
      //   });
      // const totalRemainQuantityByUom = inventoryStockOfAMaterialVariant.reduce(
      //   (acc, item) => acc + item.quantityByUom,
      //   0,
      // );
      // Logger.debug('totalRemainQuantityByUom', totalRemainQuantityByUom);
      // Logger.debug(
      //   'target quantity',
      //   materialExportRequestDetail.quantityByUom,
      // );
      // if (
      //   totalRemainQuantityByUom < materialExportRequestDetail.quantityByUom
      // ) {
      //   const notEnoughMaterialExportRequestDetail = {
      //     ...materialExportRequestDetail,
      //     remainQuantityByUom: totalRemainQuantityByUom,
      //     missingQuantityByUom:
      //       materialExportRequestDetail.quantityByUom -
      //       totalRemainQuantityByUom,
      //     isFullFilled: false,
      //   };
      //   delete materialExportRequestDetail.materialVariant.materialPackage;
      //   notEnoughMaterialExportRequestDetails.push(
      //     notEnoughMaterialExportRequestDetail,
      //   );
      //   continue;
      // }
    }

    const exportAlgorithmParam: ExportAlgorithmParam =
      materialExportRequest.materialExportRequestDetail.map((detail) => ({
        materialVariantId: detail.materialVariantId,
        targetQuantityUom: detail.quantityByUom,
        allMaterialReceipts: detail.materialVariant.materialPackage?.flatMap(
          (materialPackage) => {
            return materialPackage.materialReceipt.map((materialReceipt) => {
              let date = new Date();
              switch (exportAlgorithmEnum) {
                case ExportAlgorithmEnum.FIFO:
                  date = materialReceipt.importDate;
                  break;
                case ExportAlgorithmEnum.LIFO:
                  date = materialReceipt.importDate;
                  break;
                case ExportAlgorithmEnum.FEFO:
                  date = materialReceipt.expireDate;
                  break;
                default:
                  throw new Error('Invalid export algorithm');
              }
              return {
                id: materialReceipt.id,
                remainQuantityByPack: materialReceipt.remainQuantityByPack,
                uomPerPack: materialPackage.uomPerPack,
                date: date,
              };
            });
          },
        ),
      }));

    // Handle the algorithm
    let algorithmResult: ExportAlgorithmResults;
    switch (exportAlgorithmEnum) {
      case ExportAlgorithmEnum.FIFO:
        algorithmResult =
          await this.exportAlgorithmService.getBestQuantityByPackFIFO(
            exportAlgorithmParam,
          );
        break;
      case ExportAlgorithmEnum.LIFO:
        algorithmResult =
          await this.exportAlgorithmService.getBestQuantityByPackLIFO(
            exportAlgorithmParam,
          );
        break;
      case ExportAlgorithmEnum.FEFO:
        algorithmResult =
          await this.exportAlgorithmService.getBestQuantityByPackFEFO(
            exportAlgorithmParam,
          );
        break;
      default:
        throw new Error('Invalid export algorithm');
    }

    // if (notEnoughMaterialExportRequestDetails.length > 0) {
    //   return apiSuccess(
    //     409,
    //     notEnoughMaterialExportRequestDetails,
    //     'There are not enough materials to export',
    //   );
    // }

    let isAllFullFilled = true;

    const materialExportRequestDetails = await Promise.all(
      algorithmResult.flatMap(async (materialExportRequestDetail) => {
        if (materialExportRequestDetail.isFullFilled !== true)
          isAllFullFilled = false;
        return {
          ...materialExportRequestDetail,
          materialVariant: await this.prismaService.materialVariant.findFirst({
            where: {
              id: materialExportRequestDetail.materialVariantId,
            },
            include: {
              material: {
                include: materialInclude,
              },
            },
          }),
          needMaterialReceipts: await Promise.all(
            materialExportRequestDetail.needMaterialReceipts.map(
              async (needMaterialReceipt) => ({
                materialReceiptId: needMaterialReceipt.id,
                materialReceipt:
                  await this.prismaService.materialReceipt.findFirst({
                    where: {
                      id: needMaterialReceipt.id,
                    },
                    include: {
                      materialPackage: true,
                    },
                  }),
                quantityByPack: needMaterialReceipt.quantityByPack,
                uomPerPack: needMaterialReceipt.uomPerPack,
                date: needMaterialReceipt.date,
              }),
            ),
          ),
        };
      }),
    );

    const flattenMaterialExportReceiptDetails = await Promise.all(
      algorithmResult.flatMap((detail) => {
        return detail.needMaterialReceipts.map(async (needMaterialReceipt) => ({
          materialExportReceiptId: undefined,
          materialReceiptId: needMaterialReceipt.id,
          materialReceipt: await this.prismaService.materialReceipt.findUnique({
            where: {
              id: needMaterialReceipt.id,
            },
            include: {
              materialPackage: {
                include: {
                  materialVariant: {
                    include: {
                      material: {
                        include: materialInclude,
                      },
                    },
                  },
                },
              },
            },
          }),
          quantityByPack: needMaterialReceipt.quantityByPack,
        }));
      }),
    );

    if (isAllFullFilled) {
      return apiSuccess(
        200,
        flattenMaterialExportReceiptDetails,
        'There are enough materials to export',
      );
    } else {
      return apiSuccess(
        409,
        {
          fullFilledMaterialExportRequestDetails:
            materialExportRequestDetails.filter(
              (detail) => detail.isFullFilled,
            ),
          notFullFilledMaterialExportRequestDetails:
            materialExportRequestDetails.filter(
              (detail) => !detail.isFullFilled,
            ),
          flattenMaterialExportReceiptDetails,
        },
        'There are not enough materials to export',
      );
    }
  }

  update(
    id: string,
    updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto,
  ) {
    return `This action updates a #${id} materialExportReceipt`;
  }

  remove(id: string) {
    return `This action removes a #${id} materialExportReceipt`;
  }

  async warehouseStaffExport(
    warehouseStaffExportDto: WarehouseStaffExportDto,
    // warehouseStaff: AuthenUser,
  ) {
    switch (warehouseStaffExportDto.action) {
      case WarehouseStaffExportAction.EXPORTING:
        const isAnyAwaitOrInProgressReportPlan: boolean =
          await this.isAnyWaitOrInProgressReportPlan();
        let materialExportRequestStatus: $Enums.MaterialExportRequestStatus =
          $Enums.MaterialExportRequestStatus.EXPORTING;
        let materialExportReceiptStatus: $Enums.MaterialExportRequestStatus =
          $Enums.ExportReceiptStatus.EXPORTING;
        if (isAnyAwaitOrInProgressReportPlan) {
          materialExportRequestStatus =
            $Enums.MaterialExportRequestStatus.AWAIT_TO_EXPORT;
          materialExportReceiptStatus =
            $Enums.ExportReceiptStatus.AWAIT_TO_EXPORT;
        }

        const materialExportReceipt1 =
          await this.prismaService.materialExportReceipt.update({
            where: {
              materialExportRequestId:
                warehouseStaffExportDto.materialExportRequestId,
            },
            data: {
              status: materialExportReceiptStatus,
            },
            include: materialExportReceiptInclude,
          });
        const materialExportRequest1 =
          await this.prismaService.materialExportRequest.update({
            where: { id: warehouseStaffExportDto.materialExportRequestId },
            data: {
              status: materialExportRequestStatus,
            },
          });
        return {
          materialExportReceipt: materialExportReceipt1,
          materialExportRequest: materialExportRequest1,
        };

      case WarehouseStaffExportAction.EXPORTED:
        var materialExportReceipt2 =
          await this.prismaService.materialExportReceipt.update({
            where: {
              materialExportRequestId:
                warehouseStaffExportDto.materialExportRequestId,
            },
            data: {
              status: $Enums.ExportReceiptStatus.EXPORTED,
            },
            include: materialExportReceiptInclude,
          });
        const materialExportRequest2 =
          await this.prismaService.materialExportRequest.update({
            where: { id: warehouseStaffExportDto.materialExportRequestId },
            data: {
              status: WarehouseStaffExportAction.EXPORTED,
            },
          });
        return {
          materialExportReceipt: materialExportReceipt2,
          materialExportRequest: materialExportRequest2,
        };

      case WarehouseStaffExportAction.DELIVERING:
        const materialExportReceipt3 =
          await this.prismaService.materialExportReceipt.update({
            where: { id: warehouseStaffExportDto.materialExportRequestId },
            data: {
              status: $Enums.ExportReceiptStatus.DELIVERING,
            },
          });
        const materialExportRequest3 =
          await this.prismaService.materialExportRequest.update({
            where: { id: warehouseStaffExportDto.materialExportRequestId },
            data: {
              status: $Enums.MaterialExportRequestStatus.DELIVERING,
            },
            include: materialExportRequestInclude,
          });
        return {
          materialExportReceipt: materialExportReceipt3,
          materialExportRequest: materialExportRequest3,
        };

      case WarehouseStaffExportAction.DELIVERED:
        const materialExportReceipt4 =
          await this.prismaService.materialExportReceipt.update({
            where: { id: warehouseStaffExportDto.materialExportRequestId },
            data: {
              status: $Enums.ExportReceiptStatus.DELIVERED,
            },
            include: materialExportReceiptInclude,
          });
        const materialExportRequest4 =
          await this.prismaService.materialExportRequest.update({
            where: { id: warehouseStaffExportDto.materialExportRequestId },
            data: {
              status: $Enums.MaterialExportRequestStatus.DELIVERED,
            },
            include: materialExportRequestInclude,
          });
        const task = await this.taskService.updateTaskStatusToDone({
          materialExportReceiptId:
            warehouseStaffExportDto.materialExportRequestId,
        });
        Logger.log('updateTaskStatusToDone', task);
        return {
          materialExportReceipt: materialExportReceipt4,
          materialExportRequest: materialExportRequest4,
        };
      default:
        throw new Error('Invalid action');
    }
  }

  async productionStaffApprove(
    productionStaffApproveDto: ProductionStaffApproveDto,
  ) {
    const materialExportRequest =
      await this.prismaService.materialExportRequest.update({
        where: { id: productionStaffApproveDto.materialExportRequestId },
        data: {
          status:
            productionStaffApproveDto.action ===
            ProductionStaffCApproveAction.PRODUCTION_APPROVED
              ? $Enums.MaterialExportRequestStatus.PRODUCTION_APPROVED
              : $Enums.MaterialExportRequestStatus.PRODUCTION_REJECTED,
        },
        include: materialExportRequestInclude,
      });
    return materialExportRequest;
  }

  async isAnyWaitOrInProgressReportPlan() {
    const result = await this.prismaService.inventoryReportPlan.findMany({
      where: {
        status: {
          in: [
            $Enums.InventoryReportPlanStatus.AWAIT,
            $Enums.InventoryReportPlanStatus.IN_PROGRESS,
          ],
        },
      },
    });
    return result.length > 0;
  }
}
