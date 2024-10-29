import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { isNotEmpty } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { CustomHttpException } from 'src/common/filter/custom-http.exception';
import { CustomValidationException } from 'src/common/filter/custom-validation.exception';
import { nonExistUUID } from 'src/common/utils/utils';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { ManagerProcessDto } from './dto/import-request/manager-process.dto';
import { PurchasingStaffProcessDto } from './dto/import-request/purchasing-staff-process.dto';
import { UpdateImportRequestDto } from './dto/import-request/update-import-request.dto';

@Injectable()
export class ImportRequestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poDeliveryService: PoDeliveryService,
  ) {}

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
      pageMeta: {
        offset: offset,
        limit: limit,
        page: Math.ceil(offset / limit) + 1,
        total: total,
        totalPages: Math.ceil(total / limit),
        hasNext: total > offset + limit,
        hasPrevious: offset > 0,
      },
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
    ] = await this.prismaService.$transaction([
      this.prismaService.importRequest.count(),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.ARRIVED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.CANCELED },
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
    ]);

    return {
      total,
      arrived,
      cancelled,
      inspecting,
      inspected,
      approved,
      rejected,
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
      },
    });
  }

  async findUnique(id: string) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      include: importRequestInclude,
    });
    if (!importRequest) {
      throw new NotFoundException("Import request doesn't exist");
    }
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
            $Enums.ImportRequestStatus.CANCELED,
            $Enums.ImportRequestStatus.REJECTED,
          ],
        },
      },
    });
  }

  async create(dto: CreateImportRequestDto) {
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
      rejectReason: dto.rejectReason,
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

    const [result, updatePoDelivery] = await this.prismaService.$transaction([
      this.prismaService.importRequest.create({
        data: createImportRequestInput,
        include: importRequestInclude,
      }),
      this.poDeliveryService.updateStatus(
        dto.poDeliveryId,
        $Enums.PoDeliveryStatus.IMPORTING,
      ),
    ]);
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
      rejectReason: dto.rejectReason,
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
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      select: { status: true },
    });
    if (
      purchasingStaffProcessDto.action == $Enums.ImportRequestStatus.CANCELED
    ) {
      const allowCancel: $Enums.ImportRequestStatus[] = [
        $Enums.ImportRequestStatus.ARRIVED,
      ];
      if (!allowCancel.includes(importRequest.status)) {
        throw new BadRequestException(
          `Purchasing staff only can cancel import request with status ${allowCancel.join(
            ', ',
          )}`,
        );
      }
      return await this.prismaService.importRequest.update({
        where: { id: id },
        data: {
          status: $Enums.ImportRequestStatus.CANCELED,
          cancelReason: purchasingStaffProcessDto.cancelReason,
        },
      });
    } else {
      throw new BadRequestException(
        `Allowed action is ${$Enums.ImportRequestStatus.CANCELED}`,
      );
    }
  }

  // REJECTED
  // APPROVED
  async managerProcess(id: string, managerProcess: ManagerProcessDto) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      select: { status: true },
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
        return await this.prismaService.importRequest.update({
          where: { id: id },
          data: {
            status: $Enums.ImportRequestStatus.APPROVED,
          },
        });
      case $Enums.ImportRequestStatus.REJECTED:
        return await this.prismaService.importRequest.update({
          where: { id },
          data: {
            status: $Enums.ImportRequestStatus.REJECTED,
            rejectAt: new Date(),
            rejectReason: managerProcess.rejectReason,
          },
        });
    }
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
}

export const importRequestInclude: Prisma.ImportRequestInclude = {
  importRequestDetail: {
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
              materialInspectionCriteria: true,
            },
          },
        },
      },
    },
  },
  warehouseManager: {
    include: {
      account: true,
    },
  },
  purchasingStaff: {
    include: {
      account: true,
    },
  },
  warehouseStaff: {
    include: {
      account: true,
    },
  },
  poDelivery: {
    include: {
      purchaseOrder: {
        include: {
          purchasingStaff: {
            include: {
              account: true,
            },
          },
          supplier: true,
        },
      },
    },
  },
};
