import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  $Enums,
  ImportRequest,
  ImportRequestStatus,
  Prisma,
  PrismaClient,
  ProductionBatchStatus,
  RoleCode,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { isNotEmpty } from 'class-validator';
import {
  importRequestInclude,
  importRequestIncludeUnique,
  materialPackageInclude,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { CustomHttpException } from 'src/common/filter/custom-http.exception';
import { CustomValidationException } from 'src/common/filter/custom-validation.exception';
import { getPageMeta, nonExistUUID } from 'src/common/utils/utils';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { DiscussionService } from '../discussion/discussion.service';
import { InspectionRequestService } from '../inspection-request/inspection-request.service';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { ProductionBatchService } from '../production-batch/production-batch.service';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { TaskService } from '../task/task.service';
import { UserService } from '../user/user.service';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { CreateProductImportRequestDto } from './dto/import-request/create-product-import-request.dto';
import { ManagerProcessDto } from './dto/import-request/manager-process.dto';
import { ProductionDepartmentCreateReturnImportRequestDto } from './dto/import-request/production-department-create-return-import-request.dto';
import { PurchasingStaffProcessDto } from './dto/import-request/purchasing-staff-process.dto';
import { ReassignImportRequestDto } from './dto/import-request/reassign-import-request.dto';
import { UpdateImportRequestDto } from './dto/import-request/update-import-request.dto';

@Injectable()
export class ImportRequestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poDeliveryService: PoDeliveryService,
    private readonly inspectionRequestService: InspectionRequestService,
    private readonly productionBatchService: ProductionBatchService,
    private readonly discussionService: DiscussionService,
    private readonly taskService: TaskService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}
  // async updateAwaitStatusToImportingStatus() {
  //   await this.prismaService.importRequest.updateMany({
  //     where: {
  //       status: ImportRequestStatus.AWAIT_TO_IMPORT,
  //     },
  //     data: {
  //       status: ImportRequestStatus.IMPORTING,
  //     },
  //   });
  // }
  async getLatest(from: any, to: any) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    const result = await this.prismaService.importRequest.findFirst({
      where: {
        OR: [
          {
            startedAt: { gte: fromDate },
          },
          {
            finishedAt: { lte: toDate },
          },
        ],
      },
      orderBy: {
        startedAt: 'desc',
      },
      include: importRequestInclude,
    });
    return apiSuccess(
      HttpStatus.OK,
      result,
      'Get latest import request successfully',
    );
  }

  async isAnyImportingImportRequest() {
    const result = await this.prismaService.importRequest.findMany({
      where: {
        status: ImportRequestStatus.IMPORTING,
      },
    });
    return result;
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.ImportRequestWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.importRequest.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: importRequestInclude,
      }),
      this.prismaService.importRequest.count(
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

  async getStatistic() {
    const [
      total,
      arrived,
      cancelled,
      inspecting,
      inspected,
      approved,
      rejected,
      importing,
      imported,
    ] = await this.prismaService.$transaction([
      this.prismaService.importRequest.count(),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.ARRIVED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.CANCELLED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.INSPECTING },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.INSPECTED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.APPROVED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.REJECTED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.IMPORTING },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.IMPORTED },
      }),
    ]);

    return {
      total,
      arrived,
      cancelled,
      inspecting,
      inspected,
      approved,
      rejected,
      importing,
      imported,
    };
  }

  findAll() {
    return this.prismaService.importRequest.findMany({
      include: importRequestInclude,
    });
  }

  updateImportRequestStatus(
    importRequestId: any,
    requestStatus: $Enums.ImportRequestStatus,
    prismaInstance: PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      DefaultArgs
    > = this.prismaService,
  ) {
    return prismaInstance.importRequest.update({
      where: {
        id: importRequestId,
      },
      data: {
        status: requestStatus,
        finishedAt: new Date(),
      },
    });
  }

  async findUnique(id: string) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      include: importRequestIncludeUnique,
    });
    if (!importRequest) {
      throw new NotFoundException("Import request doesn't exist");
    }
    return importRequest;
  }

  async findUniqueForNotification(id: string) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      include: {
        warehouseStaff: {
          include: {
            account: true,
          },
        },
        purchasingStaff: {
          include: {
            account: true,
          },
        },
        warehouseManager: {
          include: {
            account: true,
          },
        },
      },
    });
    return importRequest;
  }

  async findFirst(id: string) {
    const importRequest = await this.prismaService.importRequest.findFirst({
      where: { id },
      include: importRequestInclude,
    });
    return importRequest;
  }

  async getActiveImportReqOfPoDelivery(poDeliveryId: string) {
    return this.prismaService.importRequest.findFirst({
      where: {
        poDeliveryId,
        status: {
          notIn: [
            $Enums.ImportRequestStatus.CANCELLED,
            $Enums.ImportRequestStatus.REJECTED,
          ],
        },
      },
    });
  }

  async getActiveImportReqOfProductionBach(productionBatchId: string) {
    return this.prismaService.importRequest.findFirst({
      where: {
        productionBatchId,
        status: {
          notIn: [
            $Enums.ImportRequestStatus.CANCELLED,
            $Enums.ImportRequestStatus.REJECTED,
          ],
        },
      },
    });
  }

  async createMaterialImportRequest(
    purchasingStaff: AuthenUser,
    dto: CreateImportRequestDto,
  ) {
    const activeImportReq = await this.getActiveImportReqOfPoDelivery(
      dto.poDeliveryId,
    );
    if (activeImportReq)
      throw new CustomHttpException(
        HttpStatus.BAD_REQUEST,
        apiFailed(
          HttpStatus.BAD_REQUEST,
          'Po delivery has active import request',
          { activeImportRequest: activeImportReq },
        ),
      );

    const createImportRequestInput: Prisma.ImportRequestCreateInput = {
      warehouseManager: dto.warehouseManagerId
        ? { connect: { id: dto.warehouseManagerId } }
        : undefined,
      purchasingStaff: purchasingStaff.purchasingStaffId
        ? { connect: { id: purchasingStaff.purchasingStaffId } }
        : undefined,
      warehouseStaff: dto.warehouseStaffId
        ? { connect: { id: dto.warehouseStaffId } }
        : undefined,
      poDelivery: dto.poDeliveryId
        ? { connect: { id: dto.poDeliveryId } }
        : undefined,
      status: dto.status,
      description: dto.description,
      cancelReason: dto.cancelReason,
      startedAt: dto.startAt,
      finishedAt: dto.finishAt,
      type: dto.type,
      code: undefined,
      importRequestDetail: {
        createMany: {
          data: dto.importRequestDetails,
        },
      },
    };

    const poDelivery = await this.poDeliveryService.checkIsPoDeliveryStatus(
      dto.poDeliveryId,
    );

    const errorResponse = await this.poDeliveryService.checkIsPoDeliveryValid(
      poDelivery,
      dto.importRequestDetails,
    );
    if (isNotEmpty(errorResponse)) {
      throw new CustomValidationException(
        HttpStatus.BAD_REQUEST,
        'Invalid data',
        errorResponse,
      );
    }
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const resultOut = await prismaInstance.importRequest.create({
          data: createImportRequestInput,
          include: importRequestInclude,
        });
        await this.poDeliveryService.updateStatus(
          dto.poDeliveryId,
          $Enums.PoDeliveryStatus.IMPORTING,
        );

        return resultOut;
      },
    );
    // const discussion = await this.discussionService.create({
    //   importRequestId: result.id,
    // });
    // if (discussion) {
    //   const account = await this.userService.findOne({
    //     id: purchasingStaff.userId,
    //   });
    //   const chat: CreateChatDto = {
    //     discussionId: discussion.id,
    //     message: `Import request created by ${account.firstName} ${account.lastName}`,
    //   };
    //   const chatResult =
    //     await this.chatService.createBySystemWithoutResponse(chat);
    //   discussion.chat.push(chatResult);
    // }
    // result.discussion = discussion;
    result.discussion =
      await this.autoCreateDiscussionAfterImportRequestCreated(
        result,
        purchasingStaff.userId,
      );
    return result;
  }

  async autoCreateDiscussionAfterImportRequestCreated(
    importRequest: ImportRequest,
    userId: string,
  ) {
    const discussion = await this.discussionService.create({
      importRequestId: importRequest.id,
    });
    if (discussion) {
      const account = await this.userService.findOne({
        id: userId,
      });
      const chat: CreateChatDto = {
        discussionId: discussion.id,
        message: `Import material request created by ${account.firstName} ${account.lastName}`,
      };
      const chatResult =
        await this.chatService.createBySystemWithoutResponse(chat);
      discussion.chat.push(chatResult);
    }
    return discussion;
  }

  async productionDepartmentCreateReturnImportRequest(
    dto: ProductionDepartmentCreateReturnImportRequestDto,
    productionDepartmentId: string,
  ) {
    const materialExportRequest =
      await this.prismaService.materialExportRequest.findUnique({
        where: {
          id: dto.materialExportRequestId,
        },
        include: {
          materialExportReceipt: {
            include: {
              materialExportReceiptDetail: {
                include: {
                  materialReceipt: {
                    include: {
                      materialPackage: { include: materialPackageInclude },
                    },
                  },
                },
              },
            },
          },
        },
      });
    if (!materialExportRequest) {
      throw new NotFoundException("Material export request doesn't exist");
    }
    if (
      materialExportRequest.status !==
      $Enums.MaterialExportRequestStatus.PRODUCTION_REJECTED
    ) {
      throw new BadRequestException(
        'Material export request must be production rejected',
      );
    }

    const importRequestDetails = new Map<string, number>();

    materialExportRequest.materialExportReceipt.materialExportReceiptDetail.forEach(
      (detail) => {
        if (
          importRequestDetails.get(detail.materialReceipt.materialPackageId)
        ) {
          importRequestDetails.set(
            detail.materialReceipt.materialPackageId,
            importRequestDetails.get(detail.materialReceipt.materialPackageId) +
              detail.quantityByPack,
          );
        } else {
          importRequestDetails.set(
            detail.materialReceipt.materialPackageId,
            detail.quantityByPack,
          );
        }
      },
    );
    const createImportRequestInput: Prisma.ImportRequestCreateInput = {
      productionDepartment: {
        connect: { id: productionDepartmentId },
      },
      status: $Enums.ImportRequestStatus.ARRIVED,
      description: 'Import request for return material',
      type: $Enums.ImportRequestType.MATERIAL_RETURN,
      importRequestDetail: {
        createMany: {
          data: Array.from(importRequestDetails).map(([key, value]) => ({
            materialPackageId: key,
            quantityByPack: value,
          })),
        },
      },
    };
    const result = await this.prismaService.importRequest.create({
      data: createImportRequestInput,
      include: importRequestInclude,
    });
    return result;
  }

  update(id: string, dto: UpdateImportRequestDto) {
    const detailIds = dto.importRequestDetails
      .filter((detail) => detail.id)
      .map((detail) => detail.id);

    const updateImportRequestInput: Prisma.ImportRequestUpdateInput = {
      warehouseManager: dto.warehouseManagerId
        ? { connect: { id: dto.warehouseManagerId } }
        : undefined,
      purchasingStaff: dto.purchasingStaffId
        ? { connect: { id: dto.purchasingStaffId } }
        : undefined,
      warehouseStaff: dto.warehouseStaffId
        ? { connect: { id: dto.warehouseStaffId } }
        : undefined,
      poDelivery: dto.poDeliveryId
        ? { connect: { id: dto.poDeliveryId } }
        : undefined,
      status: dto.status,
      description: dto.description,
      managerNote: dto.managerNote,
      cancelReason: dto.cancelReason,
      startedAt: dto.startAt,
      finishedAt: dto.finishAt,
      type: dto.type,
      importRequestDetail: dto.importRequestDetails
        ? {
            upsert: dto.importRequestDetails.map((detail) => ({
              where: {
                id: detail.id || nonExistUUID,
              }, // Use a non-existent UUID if undefined or empty
              update: detail,
              create: detail,
            })),
            deleteMany: {
              id: {
                notIn: detailIds,
              },
            },
          }
        : undefined,
    };

    return this.prismaService.importRequest.update({
      where: { id },
      data: updateImportRequestInput,
      include: importRequestInclude,
    });
  }

  remove(id: string) {
    return this.prismaService.importRequest.delete({
      where: { id },
    });
  }

  getEnum() {
    return {
      importRequestType: Object.values($Enums.ImportRequestType),
      importRequestStatus: Object.values($Enums.ImportRequestStatus),
    };
  }

  async purchasingStaffCancelImportReq(
    id: string,
    purchasingStaffProcessDto: PurchasingStaffProcessDto,
  ) {
    const importRequestCheck =
      await this.prismaService.importRequest.findUnique({
        where: { id },
      });
    if (
      purchasingStaffProcessDto.action == $Enums.ImportRequestStatus.CANCELLED
    ) {
      const allowCancel: $Enums.ImportRequestStatus[] = [
        $Enums.ImportRequestStatus.ARRIVED,
      ];
      if (!allowCancel.includes(importRequestCheck.status)) {
        throw new BadRequestException(
          `Purchasing staff only can cancel import request with status ${allowCancel.join(
            ', ',
          )}`,
        );
      }
      const [importRequest, poDelivery] = await this.prismaService.$transaction(
        [
          this.prismaService.importRequest.update({
            where: { id: id },
            data: {
              status: $Enums.ImportRequestStatus.CANCELLED,
              cancelReason: purchasingStaffProcessDto.cancelReason,
              cancelledAt: new Date(),
            },
          }),
          this.prismaService.poDelivery.update({
            where: { id: importRequestCheck.poDeliveryId },
            data: {
              status: $Enums.PoDeliveryStatus.PENDING,
            },
          }),
        ],
      );
      return { importRequest, poDelivery };
    } else {
      throw new BadRequestException(
        `Allowed action is ${$Enums.ImportRequestStatus.CANCELLED}`,
      );
    }
  }

  // REJECTED
  // APPROVED
  async managerProcess(
    account: AuthenUser,
    id: string,
    managerProcess: ManagerProcessDto,
  ) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        warehouseManagerId: true,
        discussion: true,
      },
    });

    const allowApproveAndReject: $Enums.ImportRequestStatus[] = [
      $Enums.ImportRequestStatus.ARRIVED,
      $Enums.ImportRequestStatus.INSPECTED,
    ];

    if (importRequest.status !== $Enums.ImportRequestStatus.ARRIVED) {
      throw new BadRequestException(
        `Manager only can approve/reject ${allowApproveAndReject.join(', ')} import request`,
      );
    }

    switch (managerProcess.action) {
      case $Enums.ImportRequestStatus.APPROVED:
        const importRequest = await this.prismaService.importRequest.update({
          where: { id: id },
          data: {
            status: $Enums.ImportRequestStatus.INSPECTING,
            managerNote: managerProcess.managerNote,
            warehouseStaffId: managerProcess.warehouseStaffId,
            warehouseManagerId: account.warehouseManagerId,
            inspectExpectedStartedAt: managerProcess.inspectExpectedStartedAt,
            inspectExpectedFinishedAt: managerProcess.inspectExpectedFinishedAt,
            importExpectedStartedAt: managerProcess.importExpectedStartedAt,
            importExpectedFinishedAt: managerProcess.importExpectedFinishedAt,
          },
          include: {
            discussion: true,
          },
        });
        const chat: CreateChatDto = {
          discussionId: importRequest.discussion.id,
          message: Constant.ARRIVED_TO_APPROVED,
        };
        await this.chatService.createWithoutResponse(chat, account);

        const inspectionRequest =
          await this.inspectionRequestService.createInspectionRequestByImportRequest(
            account.warehouseManagerId,
            managerProcess,
            importRequest,
          );

        const task = await this.createTaskByImportRequestAfterApproved(
          importRequest,
          managerProcess.warehouseStaffId,
        );

        return { importRequest, inspectionRequest, task };

      case $Enums.ImportRequestStatus.REJECTED:
        const result = await this.prismaService.importRequest.update({
          where: { id },
          data: {
            status: $Enums.ImportRequestStatus.REJECTED,
            rejectAt: new Date(),
            warehouseManagerId: account.warehouseManagerId,
            managerNote: managerProcess.managerNote,
          },
        });
        const chat2: CreateChatDto = {
          discussionId: importRequest.discussion.id,
          message: Constant.ARRIVED_TO_CANCELED,
        };
        await this.chatService.createWithoutResponse(chat2, account);
        //reverse po delivery status to pending status
        if (importRequest.status.startsWith('MATERIAL')) {
          await this.prismaService.poDelivery.update({
            where: { id: importRequest.poDeliveryId },
            data: {
              status: $Enums.PoDeliveryStatus.PENDING,
            },
          });
        } else if (importRequest.status.startsWith('PRODUCT')) {
          await this.prismaService.productionBatch.update({
            where: { id: importRequest.productionBatchId },
            data: {
              status: $Enums.ProductionBatchStatus.PENDING,
            },
          });
        }
        return result;
      default:
        throw new BadRequestException(
          `Allowed action is ${$Enums.ImportRequestStatus.APPROVED} or ${$Enums.ImportRequestStatus.REJECTED}`,
        );
    }
  }

  async createTaskByImportRequestAfterApproved(
    importRequest: ImportRequest,
    warehouseId: string,
  ) {
    const createTaskDto: CreateTaskDto = {
      taskType: 'IMPORT',
      importRequestId: importRequest.id,
      warehouseStaffId: warehouseId,
      status: $Enums.TaskStatus.OPEN,
      expectedStartedAt: importRequest.importExpectedStartedAt,
      expectedFinishedAt: importRequest.importExpectedFinishedAt,
    };
    const task = await this.taskService.create(createTaskDto);
    return task;
  }

  async getImportRequestOfInspectionRequest(inspectionRequestId: string) {
    const importRequest = await this.prismaService.importRequest.findFirst({
      where: {
        inspectionRequest: {
          some: {
            id: inspectionRequestId,
            deletedAt: null,
          },
        },
      },
      select: {
        importRequestDetail: {
          select: {
            materialPackageId: true,
            productSizeId: true,
          },
        },
      },
    });

    return importRequest;
  }

  async isInspectReportMaterialVariantInImportRequest(
    inspectionRequestId: string,
    materialPackageIds: string[],
  ) {
    const importRequest =
      await this.getImportRequestOfInspectionRequest(inspectionRequestId);

    if (!importRequest) {
      throw new BadRequestException(
        'There is no import request for this inspection request',
      );
    }

    const materialVariantsInDb = new Set(
      importRequest.importRequestDetail.map(
        (detail) => detail.materialPackageId,
      ),
    );
    return materialPackageIds.every((id) => materialVariantsInDb.has(id));
  }

  async isInspectReportProductVariantInImportRequest(
    importRequestId: string,
    productVariantIds: string[],
  ) {
    const importRequest =
      await this.getImportRequestOfInspectionRequest(importRequestId);

    if (!importRequest) {
      throw new BadRequestException(
        'There is no import request for this inspection request',
      );
    }

    const productVariantsInDb = new Set(
      importRequest.importRequestDetail.map((detail) => detail.productSizeId),
    );
    return productVariantIds.every((id) => productVariantsInDb.has(id));
  }

  async getByUserToken(
    authenUser: AuthenUser,
    findOptions: GeneratedFindOptions<Prisma.ImportRequestWhereInput>,
  ) {
    switch (authenUser.role) {
      case RoleCode.WAREHOUSE_MANAGER:
        findOptions.where = {
          ...findOptions.where,
          warehouseManagerId: authenUser.warehouseManagerId,
        };
        return this.search(findOptions);
      case RoleCode.WAREHOUSE_STAFF:
        findOptions.where = {
          ...findOptions.where,
          warehouseStaffId: authenUser.warehouseStaffId,
        };
        return this.search(findOptions);
      case RoleCode.PURCHASING_STAFF:
        findOptions.where = {
          ...findOptions.where,
          purchasingStaffId: authenUser.purchasingStaffId,
        };
        return this.search(findOptions);
      default:
        throw new ForbiddenException('This role is not allowed');
    }
  }

  //Product import request
  async createProductImportRequest(
    productionDepartmentId: string,
    createImportRequestDto: CreateProductImportRequestDto,
  ) {
    const activeImportReq = await this.getActiveImportReqOfProductionBach(
      createImportRequestDto.productionBatchId,
    );
    if (activeImportReq)
      throw new CustomHttpException(
        HttpStatus.BAD_REQUEST,
        apiFailed(
          HttpStatus.BAD_REQUEST,
          'Production batch has active import request',
          { activeImportRequest: activeImportReq },
        ),
      );

    const createImportRequestInput: Prisma.ImportRequestCreateInput = {
      warehouseManager: createImportRequestDto.warehouseManagerId
        ? { connect: { id: createImportRequestDto.warehouseManagerId } }
        : undefined,
      productionDepartment: productionDepartmentId
        ? { connect: { id: productionDepartmentId } }
        : undefined,
      warehouseStaff: createImportRequestDto.warehouseStaffId
        ? { connect: { id: createImportRequestDto.warehouseStaffId } }
        : undefined,
      productionBatch: createImportRequestDto.productionBatchId
        ? { connect: { id: createImportRequestDto.productionBatchId } }
        : undefined,
      status: createImportRequestDto.status,
      description: createImportRequestDto.description,
      cancelReason: createImportRequestDto.cancelReason,
      startedAt: createImportRequestDto.startAt,
      finishedAt: createImportRequestDto.finishAt,
      type: createImportRequestDto.type,
      code: undefined,
      importRequestDetail: {
        createMany: {
          data: createImportRequestDto.importRequestDetail,
        },
      },
    };

    //Enable later
    // const productionBatch =
    //   await this.productionBatchService.chekIsProductionBatchStatus(
    //     createImportRequestDto.productionBatchId,
    //   );

    // const errorResponse =
    //   await this.productionBatchService.checkIsProductionBatchValid(
    //     productionBatch,
    //     createImportRequestDto.importRequestDetail,
    //   );
    // if (isNotEmpty(errorResponse)) {
    //   throw new CustomValidationException(
    //     HttpStatus.BAD_REQUEST,
    //     'Invalid data',
    //     errorResponse,
    //   );
    // }

    // const [result, updateProductionBatch] =
    //   await this.prismaService.$transaction([
    //     this.prismaService.importRequest.create({
    //       data: createImportRequestInput,
    //       include: importRequestInclude,
    //     }),
    //     this.productionBatchService.updateStatus(
    //       createImportRequestDto.productionBatchId,
    //       ProductionBatchStatus.IMPORTING,
    //     ),
    //   ]);

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const result = await prismaInstance.importRequest.create({
          data: createImportRequestInput,
          include: importRequestInclude,
        });
        await this.productionBatchService.updateStatus(
          createImportRequestDto.productionBatchId,
          ProductionBatchStatus.IMPORTING,
          prismaInstance,
        );
        const discussion = await this.discussionService.create(
          {
            importRequestId: result.id,
          },
          prismaInstance,
        );
        result.discussion = discussion;
        return result;
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product Import Request created successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to create Product Import Request',
    );
  }

  async getByImportReceiptId(importReceiptId: string) {
    return this.prismaService.importRequest.findFirst({
      where: {
        inspectionRequest: {
          some: {
            inspectionReport: {
              importReceipt: {
                id: importReceiptId,
              },
            },
          },
        },
      },
      include: importRequestInclude,
    });
  }

  async reassign(dto: ReassignImportRequestDto) {
    if (!dto.inspectionDepartmentId && !dto.warehouseStaffId) {
      throw new BadRequestException(
        'Warehouse staff or inspection department must be provided',
      );
    }

    const importRequestCheck =
      await this.prismaService.importRequest.findUnique({
        where: { id: dto.importRequestId },
        select: { status: true },
      });
    if (!importRequestCheck) {
      throw new NotFoundException('Import Request not found');
    }
    const allowReassignImportStatus: ImportRequestStatus[] = [
      'APPROVED',
      'INSPECTING',
      'INSPECTED',
      'AWAIT_TO_IMPORT',
    ];

    //reassign warehouse staff
    if (!allowReassignImportStatus.includes(importRequestCheck.status)) {
      throw new BadRequestException(
        `Import Request status must be ${allowReassignImportStatus.join(', ')} but current status is ${importRequestCheck.status}`,
      );
    }
    const importRequest = await this.prismaService.importRequest.update({
      where: { id: dto.importRequestId },
      data: {
        warehouseStaffId: dto.warehouseStaffId,
      },
    });
    const importReceipt = await this.prismaService.importReceipt.findFirst({
      where: {
        inspectionReport: {
          inspectionRequest: {
            importRequestId: importRequest.id,
          },
        },
      },
    });

    if (importReceipt) {
      await this.prismaService.importReceipt.update({
        where: { id: importReceipt.id },
        data: {
          warehouseStaffId: dto.warehouseStaffId,
          expectedStartedAt: dto.importExpectedStartedAt,
          expectFinishedAt: dto.importExpectedFinishedAt,
        },
      });
    }

    //reassign import task
    const importTask = await this.taskService.reassignImportRequestTask(
      importRequest.id,
      importRequest.warehouseStaffId,
      dto.importExpectedStartedAt,
      dto.importExpectedFinishedAt,
    );

    //reassign inspection staff

    const allowReassignInspectionStatus: ImportRequestStatus[] = [
      'APPROVED',
      'INSPECTING',
    ];
    if (!allowReassignInspectionStatus.includes(importRequestCheck.status)) {
      // throw new BadRequestException(
      //   `Import Request status must be ${allowReassignInspectionStatus.join(', ')} but current status is ${importRequestCheck.status}`,
      // );
      return new ApiResponse(
        400,
        { importRequest, importTask },
        `Warehouse staff reassign successfully but inspection staff reassign failed(allow status ${allowReassignInspectionStatus.join(', ')})`,
      );
    }
    const inspectionRequest =
      await this.prismaService.inspectionRequest.findFirst({
        where: {
          importRequestId: importRequest.id,
        },
      });
    let inspectionTask: Prisma.BatchPayload;
    if (inspectionRequest) {
      await this.prismaService.inspectionRequest.update({
        where: { id: inspectionRequest.id },
        data: {
          inspectionDepartmentId: dto.inspectionDepartmentId,
          expectedStartedAt: dto.inspectExpectedStartedAt,
          expectedFinishedAt: dto.inspectExpectedFinishedAt,
        },
      });
      inspectionTask = await this.taskService.reassignInspectionRequestTask(
        inspectionRequest.id,
        inspectionRequest.inspectionDepartmentId,
        dto.inspectExpectedStartedAt,
        dto.inspectExpectedFinishedAt,
      );
    }

    return { importRequest, importTask, inspectionTask };
  }
}
