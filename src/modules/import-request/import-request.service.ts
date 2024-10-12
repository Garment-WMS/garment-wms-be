import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { nonExistUUID } from 'src/common/utils/utils';
import { CustomValidationException } from 'src/common/filter/custom-validation.exception';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { ManagerProcessDto } from './dto/import-request/manager-process.dto';
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
    const [
      data,
      total,
      totalArrived,
      totalInspecting,
      totalInspected,
      totalCanceled,
      totalPending,
      totalRejected,
      totalApproved,
      totalImporting,
      totalImported,
    ] = await this.prismaService.$transaction([
      this.prismaService.importRequest.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: this.ImportRequestInclude,
      }),
      this.prismaService.importRequest.count(
        findOptions?.where
          ? {
              where: findOptions.where,
            }
          : undefined,
      ),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.ARRIVED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.INSPECTING },
      }),

      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.INSPECTED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.CANCELED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.PENDING },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.REJECTED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.APPROVED },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.IMPORTING },
      }),
      this.prismaService.importRequest.count({
        where: { status: $Enums.ImportRequestStatus.IMPORTED },
      }),
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
      statistics: {
        totalArrived,
        totalInspecting,
        totalInspected,
        totalCanceled,
        totalPending,
        totalRejected,
        totalApproved,
        totalImporting,
        totalImported,
      },
    };
    return dataResponse;
  }

  findAll() {
    return this.prismaService.importRequest.findMany({
      include: this.ImportRequestInclude,
    });
  }

  async findUnique(id: string) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      include: this.ImportRequestInclude,
    });
    if (!importRequest) {
      throw new NotFoundException("Import request doesn't exist");
    }
    return importRequest;
  }

  async findFirst(id: string) {
    const importRequest = await this.prismaService.importRequest.findFirst({
      where: { id },
      include: this.ImportRequestInclude,
    });
    return importRequest;
  }

  async create(dto: CreateImportRequestDto) {
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
      startAt: dto.startAt,
      finishAt: dto.finishAt,
      type: dto.type,
      importRequestDetail: {
        createMany: {
          data: dto.importRequestDetails,
        },
      },
    };
    const errorResponse = await this.poDeliveryService.checkIsPoDeliveryValid(
      dto.poDeliveryId,
      dto.importRequestDetails,
    );
    if (errorResponse) {
      throw new CustomValidationException(
        HttpStatus.BAD_REQUEST,
        'Invalid data',
        errorResponse,
      );
    }
    return this.prismaService.importRequest.create({
      data: createImportRequestInput,
      include: this.ImportRequestInclude,
    });
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
      startAt: dto.startAt,
      finishAt: dto.finishAt,
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
      include: this.ImportRequestInclude,
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

  // INSPECTING
  async purchasingStaffRequestInspection() {}

  // INSPECTED
  async inspectionStaffAddReport() {}

  // REJECTED
  // APPROVED
  async managerProcess(id: string, managerProcess: ManagerProcessDto) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      select: { status: true },
    });

    // if (importRequest.status !== $Enums.ImportRequestStatus.PENDING) {
    //   throw new BadRequestException(
    //     'Manager only can process PENDING import request',
    //   );
    // }

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

  // IMPORTING
  async warehouseStaffImport() {}

  // IMPORTED
  async warehouseStaffFinishImport() {}

  // CANCELED

  readonly ImportRequestInclude: Prisma.ImportRequestInclude = {
    importRequestDetail: {
      include: {
        materialVariant: {
          include: {
            material: {
              include: {
                materialType: true,
                materialAttribute: true,
              },
            },
          },
        },
      },
    },
    warehouseManager: true,
    purchasingStaff: true,
    warehouseStaff: true,
    poDelivery: {
      include: {
        purchaseOrder: {
          include: {
            purchasingStaff: true,
            supplier: true,
          },
        },
      },
    },
  };
}
