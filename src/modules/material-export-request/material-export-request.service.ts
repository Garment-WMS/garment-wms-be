import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  $Enums,
  MaterialExportRequestStatus,
  Prisma,
  RoleCode,
} from '@prisma/client';
import {
  discussionInclude,
  materialExportRequestDetailInclude,
  materialExportRequestInclude,
  materialPackageInclude,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ChangeFieldDto } from 'src/notification/dto/change-field.dto';
import { NotificationService } from 'src/notification/notification.service';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { DiscussionService } from '../discussion/discussion.service';
import { ManagerAction } from '../import-request/dto/import-request/manager-process.dto';
import { MaterialExportReceiptService } from '../material-export-receipt/material-export-receipt.service';
import { ProductionBatchService } from '../production-batch/production-batch.service';
import { TaskService } from '../task/task.service';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { ManagerApproveExportRequestDto } from './dto/manager-approve-export-request.dto';
import {
  ProductionDepartmentApproveAction,
  ProductionStaffDepartmentProcessDto,
} from './dto/production-department-approve.dto';
import { ReassignMaterialExportRequestDto } from './dto/reassign-material-export-request';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';

@Injectable()
export class MaterialExportRequestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly taskService: TaskService,
    private readonly discussionService: DiscussionService,
    private readonly chatService: ChatService,
    private readonly materialExportReceiptService: MaterialExportReceiptService,
    private readonly productionBatchService: ProductionBatchService,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {}

  async getByUserToken(
    authenUser: AuthenUser,
    findOptions: GeneratedFindOptions<Prisma.MaterialExportRequestWhereInput>,
  ) {
    switch (authenUser.role) {
      case RoleCode.WAREHOUSE_MANAGER:
        findOptions.where = {
          warehouseManagerId: authenUser.warehouseManagerId,
        };
        return this.search(findOptions);
      case RoleCode.WAREHOUSE_STAFF:
        findOptions.where = {
          warehouseStaffId: authenUser.warehouseStaffId,
        };
        return this.search(findOptions);
      case RoleCode.PRODUCTION_DEPARTMENT:
        findOptions.where = {
          productionDepartmentId: authenUser.purchasingStaffId,
        };
        return this.search(findOptions);
      default:
        throw new ForbiddenException('This role is not allowed');
    }
  }

  // async updateAwaitStatusToExportingStatus() {
  //   await this.prismaService.materialExportRequest.updateMany({
  //     where: {
  //       status: MaterialExportRequestStatus.AWAIT_TO_EXPORT,
  //     },
  //     data: {
  //       status: MaterialExportRequestStatus.EXPORTING,
  //     },
  //   });
  // }

  async isAnyExportingExportRequest(
    inventoryReportPlan: Prisma.InventoryReportPlanGetPayload<{
      include: {
        inventoryReportPlanDetail: true;
      };
    }>,
  ) {
    const materialVariantIds = [];
    const productVariantIds = [];
    inventoryReportPlan.inventoryReportPlanDetail.forEach(
      (inventoryReportPlanDetail) => {
        materialVariantIds.push(inventoryReportPlanDetail.materialVariantId);
        productVariantIds.push(inventoryReportPlanDetail.productVariantId);
      },
    );
    const result = await this.prismaService.materialExportRequest.findMany({
      where: {
        status: MaterialExportRequestStatus.EXPORTING,
        materialExportRequestDetail: {
          some: {
            materialVariantId: {
              in: materialVariantIds,
            },
          },
        },
      },
    });
    return result;
  }
  async create(dto: CreateMaterialExportRequestDto, user: AuthenUser) {
    // if (!dto.materialExportRequestDetail) {
    const productionBatch =
      await this.prismaService.productionBatch.findUniqueOrThrow({
        where: {
          id: dto.productionBatchId,
        },
        select: {
          productionBatchMaterialVariant: true,
          materialExportRequest: {
            where: {
              status: {
                notIn: [
                  MaterialExportRequestStatus.REJECTED,
                  MaterialExportRequestStatus.PRODUCTION_REJECTED,
                  MaterialExportRequestStatus.RETURNED,
                  MaterialExportRequestStatus.CANCELLED,
                ],
              },
            },
          },
        },
      });

    if (!productionBatch) {
      throw new NotFoundException('Production batch not found');
    }
    if (
      productionBatch.materialExportRequest &&
      productionBatch.materialExportRequest.length > 0
    ) {
      throw new BadRequestException(
        'Production batch already has active export request',
      );
    }

    if (
      !productionBatch.productionBatchMaterialVariant ||
      productionBatch.productionBatchMaterialVariant.length === 0
    ) {
      throw new BadRequestException('Production batch material is empty');
    }

    //todo check production batch status and production batch export request is PRODUCTION_REJECTED

    const materialExportRequestDetail =
      productionBatch.productionBatchMaterialVariant.map(
        (productionBatchMaterial) => ({
          materialVariantId: productionBatchMaterial.materialVariantId,
          quantityByUom: productionBatchMaterial.quantityByUom,
        }),
      );
    dto.materialExportRequestDetail = materialExportRequestDetail;
    // }
    const materialExportRequestInput: Prisma.MaterialExportRequestUncheckedCreateInput =
      {
        productionBatchId: dto.productionBatchId,
        productionDepartmentId: dto.productionDepartmentId,
        description: dto.description,
        status: dto.status,
        materialExportRequestDetail: {
          createMany: {
            data: dto.materialExportRequestDetail.map((detail) => ({
              materialVariantId: detail.materialVariantId,
              quantityByUom: detail.quantityByUom,
            })),
          },
        },
      };

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const result = await this.prismaService.materialExportRequest.create({
          data: materialExportRequestInput,
          include: materialExportRequestInclude,
        });

        const result2 = await this.productionBatchService.updateStatus(
          result.productionBatchId,
          $Enums.ProductionBatchStatus.EXECUTING,
          prismaInstance,
        );
        console.log(result2);
        return result;
      },
    );
    const discussion = await this.discussionService.create({
      exportRequestId: result.id,
    });
    const account = await this.prismaService.account.findUnique({
      where: {
        id: user.userId,
      },
    });
    const chat: CreateChatDto = {
      discussionId: discussion.id,
      message: `Export material request created by ${account.firstName} ${account.lastName}`,
    };
    await this.chatService.createBySystemWithoutResponse(chat);
    result.discussion = discussion;

    return result;
  }

  // async mapMaterialExportRequestDetailByFormula(
  //   productFormulaId: string,
  //   productQuantity: number,
  // ) {
  //   const productFormula = await this.prismaService.productFormula.findUnique({
  //     where: {
  //       id: productFormulaId,
  //     },
  //     include: productFormulaInclude,
  //   });
  //   if (!productFormula) {
  //     throw new NotFoundException('Product formula not found');
  //   }
  //   if (!productFormula.productFormulaMaterial) {
  //     throw new BadRequestException('Product formula material not found');
  //   }
  //   const materialExportRequestDetail =
  //     productFormula.productFormulaMaterial.map((productFormulaMaterial) => {
  //       const materialExportRequestDetail: CreateNestedMaterialExportRequestDetailDto =
  //         {
  //           materialVariantId: productFormulaMaterial.materialVariantId,
  //           quantityByUom:
  //             productFormulaMaterial.quantityByUom * productQuantity,
  //         };
  //       return materialExportRequestDetail;
  //     });
  //   return materialExportRequestDetail;
  // }

  async search(
    findOptions: GeneratedFindOptions<Prisma.MaterialExportRequestWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialExportRequest.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: materialExportRequestInclude,
      }),
      this.prismaService.materialExportRequest.count(
        findOptions?.where
          ? {
              where: findOptions.where,
            }
          : undefined,
      ),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async searchReturn(
    findOptions: GeneratedFindOptions<Prisma.MaterialExportRequestWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialExportRequest.findMany({
        skip: offset,
        take: limit,
        where: {
          status: MaterialExportRequestStatus.RETURNED,
          OR: [
            {
              importRequestProductionReject: undefined,
            },
            {
              importRequestProductionReject: {
                every: {
                  status: {
                    in: ['CANCELLED'],
                  },
                },
              },
            },
          ],

          ...findOptions?.where,
        },
        orderBy: findOptions?.orderBy,
        include: materialExportRequestInclude,
      }),
      this.prismaService.materialExportRequest.count(
        findOptions?.where
          ? {
              where: findOptions.where,
            }
          : undefined,
      ),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async findUnique(id: string) {
    const materialExportRequest =
      await this.prismaService.materialExportRequest.findUnique({
        where: {
          id: id,
        },
        include: {
          ...materialExportRequestInclude,
          materialExportReceipt: {
            include: {
              materialExportReceiptDetail: {
                include: {
                  materialReceipt: {
                    include: {
                      materialPackage: {
                        include: materialPackageInclude,
                      },
                    },
                  },
                },
              },

              task: {
                include: {
                  warehouseStaff: {
                    include: {
                      account: true,
                    },
                  },
                  todo: true,
                },
              },
            },
          },
        },
      });
    if (!materialExportRequest) {
      throw new NotFoundException('Material Export Request not found');
    }
    return materialExportRequest;
  }

  async findFirst(materialExportRequestId: string) {
    return await this.prismaService.materialExportRequest.findFirst({
      where: {
        id: materialExportRequestId,
      },
      include: materialExportRequestInclude,
    });
  }

  async update(id: string, dto: UpdateMaterialExportRequestDto) {
    const input: Prisma.MaterialExportRequestUncheckedUpdateInput = {
      productionBatchId: dto.productionBatchId,
      productionDepartmentId: dto.productionDepartmentId,
      description: dto.description,
      status: dto.status,
      materialExportRequestDetail: {
        upsert: dto.materialExportRequestDetail.map((detail) => ({
          where: {
            id: detail.id,
          },
          update: {
            materialVariantId: detail.materialVariantId,
            quantityByUom: detail.quantityByUom,
          },
          create: {
            materialVariantId: detail.materialVariantId,
            quantityByUom: detail.quantityByUom,
          },
        })),
      },
    };
    return await this.prismaService.materialExportRequest.update({
      where: {
        id: id,
      },
      data: input,
      include: materialExportRequestInclude,
    });
  }

  async remove(id: string) {
    return this.prismaService.materialExportRequest.delete({
      where: {
        id: id,
      },
    });
  }

  async managerApprove(
    materialExportRequestId: string,
    dto: ManagerApproveExportRequestDto,
    warehouseManager: AuthenUser,
  ) {
    const allowApproveStatus: $Enums.MaterialExportRequestStatus[] = [
      $Enums.MaterialExportRequestStatus.PENDING,
    ];
    const materialExportRequest = await this.findUnique(
      materialExportRequestId,
    );
    if (!allowApproveStatus.includes(materialExportRequest.status)) {
      throw new BadRequestException(
        `Cannot approve material export request with status ${materialExportRequest.status}`,
      );
    }
    switch (dto.action) {
      case ManagerAction.APPROVED:
        dto.warehouseManagerId = warehouseManager.warehouseManagerId;
        dto.materialExportReceipt.materialExportRequestId =
          materialExportRequestId;
        dto.materialExportReceipt.warehouseStaffId = dto.warehouseStaffId;
        dto.materialExportReceipt.type =
          $Enums.MaterialExportReceiptType.PRODUCTION;
        const {
          materialExportRequest,
          materialExportReceipt,
          inventoryStock,
          materialReceipt,
        } = await this.prismaService.$transaction(
          async (prismaInstance: PrismaService) => {
            const { materialExportReceipt, inventoryStock, materialReceipt } =
              await this.materialExportReceiptService.create(
                {
                  note: dto.materialExportReceipt.note,
                  type: dto.materialExportReceipt.type,
                  materialExportRequestId: materialExportRequestId,
                  warehouseStaffId: dto.warehouseStaffId,
                  expectedStartedAt: dto.exportExpectedStartedAt,
                  expectedFinishedAt: dto.exportExpectedFinishedAt,
                  materialExportReceiptDetail:
                    dto.materialExportReceipt.materialExportReceiptDetail.map(
                      (detail) => ({
                        materialReceiptId: detail.materialReceiptId,
                        quantityByPack: detail.quantityByPack,
                      }),
                    ),
                },
                warehouseManager,
              );
            const materialExportRequest =
              await prismaInstance.materialExportRequest.update({
                where: {
                  id: materialExportRequestId,
                },
                data: {
                  warehouseManagerId: dto.warehouseManagerId,
                  status: $Enums.MaterialExportRequestStatus.AWAIT_TO_EXPORT,
                  managerNote: dto.managerNote,
                  warehouseStaffId: dto.warehouseStaffId,
                  updatedAt: new Date(),
                },
                include: materialExportRequestInclude,
              });

            return {
              materialExportRequest,
              materialExportReceipt,
              inventoryStock,
              materialReceipt,
            };
          },
        );
        try {
          const task = await this.taskService.create({
            materialExportReceiptId: materialExportReceipt.id,
            taskType: $Enums.TaskType.EXPORT,
            status: $Enums.TaskStatus.OPEN,
            expectedStartedAt: materialExportReceipt.expectedStartedAt,
            expectedFinishedAt: materialExportReceipt.expectedFinishedAt,
            warehouseStaffId: dto.warehouseStaffId,
          });
        } catch (error) {
          Logger.error('Cannot create task', error, error.stack);
        }

        const discussion = await this.discussionService.updateExportReceipt(
          materialExportReceipt.id,
          materialExportReceipt.materialExportRequestId,
        );

        const createChatDto: CreateChatDto = {
          discussionId: discussion.id,
          message: Constant.PENDING_TO_APPROVE,
        };
        await this.chatService.createWithoutResponse(
          createChatDto,
          warehouseManager,
        );

        return {
          materialExportRequest,
          materialExportReceipt,
          inventoryStock,
          materialReceipt,
        };
      case ManagerAction.REJECTED:
        const rejectedMaterialExportRequest =
          await this.prismaService.materialExportRequest.update({
            where: {
              id: materialExportRequestId,
            },
            data: {
              warehouseManagerId: dto.warehouseManagerId,
              status: $Enums.MaterialExportRequestStatus.REJECTED,
              managerNote: dto.managerNote,
              rejectAt: new Date(),
              updatedAt: new Date(),
            },
            include: {
              discussion: {
                include: discussionInclude,
              },
            },
          });
        await this.productionBatchService.updateStatus(
          rejectedMaterialExportRequest.productionBatchId,
          'PENDING',
        );
        const chat: CreateChatDto = {
          discussionId: rejectedMaterialExportRequest.discussion.id,
          message: Constant.PENDING_TO_REJECT,
        };
        await this.chatService.createWithoutResponse(chat, warehouseManager);
        const changeFieldDto: ChangeFieldDto = {
          status: {
            after: MaterialExportRequestStatus.REJECTED,
            before: MaterialExportRequestStatus.PENDING,
          },
        };
        await this.eventEmitter.emit(
          'notification.materialExportRequest.updated',
          {
            changeFieldDto,
            materialExportRequest: rejectedMaterialExportRequest,
          },
        );
        return rejectedMaterialExportRequest;
      default:
        throw new BadRequestException('Invalid manager action');
    }
  }

  async getEnum() {
    return {
      status: $Enums.MaterialExportRequestStatus,
    };
  }

  async productionDepartmentApprove(
    productionStaffApproveDto: ProductionStaffDepartmentProcessDto,
    productionDepartment: AuthenUser,
  ) {
    const allowMaterialExportRequest =
      await this.prismaService.materialExportRequest.findUnique({
        where: {
          id: productionStaffApproveDto.materialExportRequestId,
          status: {
            in: [MaterialExportRequestStatus.EXPORTED],
          },
        },
      });

    if (!allowMaterialExportRequest) {
      throw new BadRequestException(
        'Material Export Request status must be ' +
          MaterialExportRequestStatus.EXPORTED,
      );
    }
    // if (
    //   allowMaterialExportRequest.productionDepartmentId !==
    //   productionDepartmentId
    // ) {
    //   throw new BadRequestException('Only requester can approve');
    // }

    switch (productionStaffApproveDto.action) {
      case ProductionDepartmentApproveAction.PRODUCTION_APPROVED:
        const result = await this.prismaService.materialExportRequest.update({
          where: {
            id: productionStaffApproveDto.materialExportRequestId,
          },
          data: {
            status: MaterialExportRequestStatus.PRODUCTION_APPROVED,
          },
          include: materialExportRequestInclude,
        });

        const productionBatch = await this.prismaService.productionBatch.update(
          {
            where: {
              id: result.productionBatchId,
            },
            data: {
              status: $Enums.ProductionBatchStatus.MANUFACTURING,
            },
          },
        );

        const chat: CreateChatDto = {
          discussionId: result.discussion.id,
          message: Constant.EXPORT_REQUEST_EXPORTED_PRODUCTION_APPROVED,
        };
        await this.chatService.createWithoutResponse(
          chat,
          productionDepartment,
        );
        this.eventEmitter.emit('start-await-inventory-report-plan');

        return result;
      case ProductionDepartmentApproveAction.PRODUCTION_REJECTED:
        const materialExportRequest =
          await this.prismaService.materialExportRequest.update({
            where: {
              id: productionStaffApproveDto.materialExportRequestId,
            },
            data: {
              status: MaterialExportRequestStatus.PRODUCTION_REJECTED,
              productionRejectReason:
                productionStaffApproveDto.productionRejectReason,
            },
            include: materialExportRequestInclude,
          });
        //create import request MATERIAL_RETURN
        const chat2: CreateChatDto = {
          discussionId: materialExportRequest.discussion.id,
          message: Constant.EXPORT_REQUEST_EXPORTED_PRODUCTION_REJECTED,
        };
        await this.chatService.createWithoutResponse(
          chat2,
          productionDepartment,
        );
        await this.productionBatchService.updateStatus(
          materialExportRequest.productionBatchId,
          $Enums.ProductionBatchStatus.PENDING,
        );
        //noti for manager
        try {
          await this.notificationService.handleNotificationMaterialExportRequestUpdatedEvent(
            {
              status: {
                before: $Enums.MaterialExportRequestStatus.EXPORTED,
                after: $Enums.MaterialExportRequestStatus.PRODUCTION_REJECTED,
              },
            },
            materialExportRequest,
          );
        } catch (error) {
          Logger.error('Cannot create task', error, error.stack);
        }
        this.eventEmitter.emit('start-await-inventory-report-plan');
        return materialExportRequest;
      default:
        throw new BadRequestException('Invalid action');
    }
  }

  async checkQuantityEnoughForExportRequest(exportRequestId: string) {
    const materialExportRequest =
      await this.prismaService.materialExportRequest.findUnique({
        where: {
          id: exportRequestId,
        },
        include: {
          materialExportRequestDetail: {
            include: materialExportRequestDetailInclude,
          },
        },
      });
    if (!materialExportRequest) {
      throw new NotFoundException('Material Export Request not found');
    }

    let result = [];

    for (const exportRequestDetail of materialExportRequest.materialExportRequestDetail) {
      const materialReceipts =
        await this.prismaService.materialReceipt.findMany({
          where: {
            materialPackage: {
              materialVariantId: exportRequestDetail.materialVariantId,
            },
            status: {
              in: [$Enums.MaterialReceiptStatus.AVAILABLE],
            },
            remainQuantityByPack: {
              gt: 0,
            },
          },
          include: {
            materialPackage: true,
          },
        });
      const remainQuantityUom = materialReceipts.reduce(
        (sum, receipt) =>
          sum +
          receipt.remainQuantityByPack * receipt.materialPackage.uomPerPack,
        0,
      );
      result.push({
        materialVariantId: exportRequestDetail.materialVariantId,
        // materialReceipts,
        requiredQuantity: exportRequestDetail.quantityByUom,
        remainQuantityByPack: remainQuantityUom,
        fullFilledPercentage:
          (remainQuantityUom / exportRequestDetail.quantityByUom) * 100,
        isFullFilled: remainQuantityUom >= exportRequestDetail.quantityByUom,
      });
    }

    return {
      isFullFilled: result.every((item) => item.isFullFilled),
      missingMaterials: result.filter((item) => !item.isFullFilled),
    };
  }

  async checkQuantityEnoughForVariant(
    materialVariantId: string,
    quantityByUom: number,
  ) {
    const materialVariant = await this.prismaService.materialVariant.findUnique(
      {
        where: {
          id: materialVariantId,
        },
      },
    );
    if (!materialVariant) {
      throw new NotFoundException('Material variant not found');
    }
    const materialReceipts = await this.prismaService.materialReceipt.findMany({
      where: {
        materialPackage: {
          materialVariantId: materialVariantId,
        },
        status: {
          in: [$Enums.MaterialReceiptStatus.AVAILABLE],
        },
        remainQuantityByPack: {
          gt: 0,
        },
      },
      include: {
        materialPackage: true,
      },
    });
    const remainQuantityByUom = materialReceipts.reduce(
      (sum, receipt) =>
        sum + receipt.remainQuantityByPack * receipt.materialPackage.uomPerPack,
      0,
    );
    return {
      materialVariantId: materialVariantId,
      requiredQuantity: quantityByUom,
      remainQuantityByPack: remainQuantityByUom,
      fullFilledPercentage: (remainQuantityByUom / quantityByUom) * 100,
      isFullFilled: remainQuantityByUom >= quantityByUom,
    };
  }

  async reassignToAnotherWarehouseStaff(dto: ReassignMaterialExportRequestDto) {
    const warehouseStaffId = dto.warehouseStaffId;
    const materialExportRequestId = dto.materialExportRequestId;

    const materialExportRequest =
      await this.prismaService.materialExportRequest.findUnique({
        where: {
          id: materialExportRequestId,
        },
        select: {
          status: true,
        },
      });
    if (!materialExportRequest) {
      throw new NotFoundException('Material Export Request not found');
    }

    const warehouseStaff = await this.prismaService.warehouseStaff.count({
      where: {
        id: warehouseStaffId,
      },
    });
    if (warehouseStaff === 0) {
      throw new NotFoundException('Warehouse Staff not found');
    }

    const allowReassignExportRequestStatus: MaterialExportRequestStatus[] = [
      'APPROVED',
      'AWAIT_TO_EXPORT',
    ];
    if (
      !allowReassignExportRequestStatus.includes(materialExportRequest.status)
    ) {
      throw new BadRequestException(
        `Cannot reassign material export request with status ${materialExportRequest.status}`,
      );
    }
    const [updatedMaterialExportRequest, materialExportReceipt] =
      await this.prismaService.$transaction([
        this.prismaService.materialExportRequest.update({
          where: {
            id: materialExportRequestId,
          },
          data: {
            warehouseStaffId: warehouseStaffId,
          },
        }),
        this.prismaService.materialExportReceipt.update({
          where: {
            materialExportRequestId: materialExportRequestId,
          },
          data: {
            warehouseStaffId: warehouseStaffId,
          },
        }),
      ]);
    return {
      materialExportRequest: updatedMaterialExportRequest,
      materialExportReceipt,
    };
  }
}
