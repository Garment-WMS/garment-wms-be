import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { UpdateImportRequestDto } from './dto/import-request/update-import-request.dto';

@Injectable()
export class ImportRequestService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(
    findOptions: GeneratedFindOptions<Prisma.ImportRequestWhereInput>,
  ) {
    const offset = findOptions?.skip
      ? parseInt(findOptions?.skip.toString())
      : Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take
      ? parseInt(findOptions?.take.toString())
      : Constant.DEFAULT_LIMIT;

    const [data, totalItems] = await this.prismaService.$transaction([
      this.prismaService.importRequest.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: {
          importRequestDetail: {
            include: {
              materialVariant: {
                include: {
                  material: {
                    include: {
                      uom: true,
                      materialType: true,
                    },
                  },
                },
              },
            },
          },

          warehouseManager: true,
          purchasingStaff: true,
          warehouseStaff: true,
          poDelivery: true,
        },
      }),
      this.prismaService.importRequest.count({
        where: findOptions?.where,
      }),
    ]);

    return {
      data,
      pageMeta: {
        totalItems,
        offset,
        limit,
        page: Math.ceil(offset / limit) + 1,
        totalPages: Math.ceil(totalItems / limit),
        hasNext: totalItems > offset + limit,
        hasPrevious: offset > 0,
      },
    };
  }

  findAll() {
    return this.prismaService.importRequest.findMany({
      include: {
        importRequestDetail: {
          include: {
            materialVariant: {
              include: {
                material: {
                  include: {
                    uom: true,
                    materialType: true,
                  },
                },
              },
            },
          },
        },
        warehouseManager: true,
        purchasingStaff: true,
        warehouseStaff: true,
        poDelivery: true,
      },
    });
  }

  async findOne(id: string) {
    const importRequest =
      await this.prismaService.importRequest.findUniqueOrThrow({
        where: { id },
        include: {
          importRequestDetail: {
            include: {
              materialVariant: {
                include: {
                  material: {
                    include: {
                      uom: true,
                      materialType: true,
                    },
                  },
                },
              },
            },
          },
          warehouseManager: true,
          purchasingStaff: true,
          warehouseStaff: true,
          poDelivery: true,
        },
      });
    if (!importRequest) {
      throw new NotFoundException("Import request doesn't exist");
    }
    return importRequest;
  }

  async create(dto: CreateImportRequestDto) {
    //check if warehouseManagerId, purchasingStaffId, warehouseStaffId, poDeliveryId exist
    // const isWarehouseManagerExistPromise =
    //   this.prismaService.warehouseManager.findUniqueOrThrow({
    //     where: { id: createImportRequestDto.warehouseManagerId },
    //   });

    // const isPurchasingStaffExistPromise =
    //   this.prismaService.purchasingStaff.findUniqueOrThrow({
    //     where: { id: createImportRequestDto.purchasingStaffId },
    //   });

    // const isWarehouseStaffExistPromise =
    //   this.prismaService.warehouseStaff.findUniqueOrThrow({
    //     where: { id: createImportRequestDto.warehouseStaffId },
    //   });

    // const isPoDeliveryExistPromise =
    //   this.prismaService.poDelivery.findUniqueOrThrow({
    //     where: { id: createImportRequestDto.poDeliveryId },
    //   });

    // const relationPromises = [];
    // if (createImportRequestDto.warehouseManagerId) {
    //   relationPromises.push(isWarehouseManagerExistPromise);
    // }
    // if (createImportRequestDto.purchasingStaffId) {
    //   relationPromises.push(isPurchasingStaffExistPromise);
    // }
    // if (createImportRequestDto.warehouseStaffId) {
    //   relationPromises.push(isWarehouseStaffExistPromise);
    // }
    // relationPromises.push(isPoDeliveryExistPromise);

    // await Promise.allSettled(relationPromises).then((results) => {
    //   let validationErrors: ValidationError[] = [];
    //   results.forEach((result, index) => {
    //     if (result) {
    //       validationErrors.push({
    //         property: index.toString(),
    //         value: undefined,
    //         contexts: {},
    //         children: [],
    //         target: createImportRequestDto,
    //         constraints: { isExist: 'Id not found' },
    //       });
    //     }
    //   });
    //   if (validationErrors.length > 0) {
    //     Logger.verbose('Validation error', validationErrors);
    //     throw new BadRequestException(
    //       apiFailed(HttpStatus.BAD_REQUEST, 'Invalid data', validationErrors),
    //     );
    //   }
    // });

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
      poDelivery: {
        connect: { id: dto.poDeliveryId },
      },
      status: dto.status,
      description: dto.description,
      rejectReason: dto.rejectReason,
      cancelReason: dto.cancelReason,
      from: dto.from,
      to: dto.to,
      startAt: dto.startAt,
      finishAt: dto.finishAt,
      type: dto.type,
      importRequestDetail: {
        createMany: {
          data: dto.importRequestDetails,
        },
      },
    };
    return this.prismaService.importRequest.create({
      data: createImportRequestInput,
    });
  }

  update(id: string, dto: UpdateImportRequestDto) {
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
      from: dto.from,
      to: dto.to,
      startAt: dto.startAt,
      finishAt: dto.finishAt,
      type: dto.type,
      importRequestDetail: dto.importRequestDetails
        ? {
            upsert: dto.importRequestDetails.map((detail) => ({
              where: { id: detail.id },
              create: detail,
              update: detail,
            })),
          }
        : undefined,
      // type: updateImportRequestDto.type,
    };
    return this.prismaService.importRequest.update({
      where: { id },
      data: updateImportRequestInput,
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

  // REJECTED
  // APPROVED
  // INSPECTING
  async managerProcess(
    isApproved: Boolean,
    updateImportRequestDto: UpdateImportRequestDto,
  ) {
    if (isApproved) {
      return this.prismaService.importRequest.update({
        where: { id: updateImportRequestDto.id },
        data: {
          status: $Enums.ImportRequestStatus.APPROVED,
          ...updateImportRequestDto,
        },
      });
    } else if (!isApproved) {
      return this.prismaService.importRequest.update({
        where: { id: updateImportRequestDto.id },
        data: {
          status: $Enums.ImportRequestStatus.REJECTED,
          ...updateImportRequestDto,
        },
      });
    }
  }

  // INSPECTED
  async inspectionDepartmentInspect() {}

  // IMPORTING
  async warehouseStaffImport() {}

  // IMPORTED
  async warehouseStaffFinishImport() {}

  // CANCELED
}
