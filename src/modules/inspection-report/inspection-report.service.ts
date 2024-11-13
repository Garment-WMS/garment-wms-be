import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { CustomValidationException } from 'src/common/filter/custom-validation.exception';
import { getPageMeta } from 'src/common/utils/utils';
import { importRequestInclude } from '../import-request/import-request.service';
import { CreateInspectionReportDto } from './dto/inspection-report/create-inspection-report.dto';
import { UpdateInspectionReportDto } from './dto/inspection-report/update-inspection-report.dto';

@Injectable()
export class InspectionReportService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUniqueByRequestId(importRequestId: string) {
    const inspectionRequest =
      await this.prismaService.inspectionRequest.findFirst({
        where: {
          importRequestId: importRequestId,
        },
      });

    if (!inspectionRequest) {
      return null;
    }

    const result = await this.prismaService.inspectionReport.findFirst({
      where: {
        inspectionRequestId: inspectionRequest.id,
      },
      include: inspectionReportInclude,
    });

    return result;
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.InspectionReportWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.inspectionReport.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: inspectionReportInclude,
      }),
      this.prismaService.inspectionReport.count(
        findOptions?.where
          ? {
              where: findOptions.where,
            }
          : undefined,
      ),
    ]);
    const dataResponse: DataResponse = {
      data: data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async findUnique(id: string) {
    const inspectionReport =
      await this.prismaService.inspectionReport.findUnique({
        where: { id },
        include: inspectionReportInclude,
      });
    if (!inspectionReport) {
      throw new NotFoundException('Inspection report not found');
    }
    return inspectionReport;
  }

  findFirst(id: string) {
    return this.prismaService.inspectionReport.findFirst({
      where: { id },
      include: inspectionReportInclude,
    });
  }

  private async mapInspectionReportByImportRequest(
    dto: CreateInspectionReportDto,
  ) {
    const importRequest = await this.prismaService.importRequest.findFirst({
      where: { id: dto.inspectionRequestId },
      include: importRequestInclude,
    });

    if (!importRequest) {
      throw new NotFoundException('Inspection request not found');
    }
    this.mapInspectionReportDetail(importRequest, dto);
  }

  private async mapInspectionReportDetail(
    importRequest,
    dto: CreateInspectionReportDto,
  ) {
    let errorInspectionReportDetail = [];
    dto.inspectionReportDetail.forEach((inspectionReportDetail) => {
      importRequest.importRequestDetail.forEach((importRequestDetail) => {
        if (
          importRequestDetail.materialPackageId ===
            inspectionReportDetail.materialPackageId ||
          importRequestDetail.productSizeId ===
            inspectionReportDetail.productSizeId
        ) {
          inspectionReportDetail.quantityByPack =
            importRequestDetail.quantityByPack;
        }
      });
      if (
        inspectionReportDetail.approvedQuantityByPack +
          inspectionReportDetail.defectQuantityByPack <
        inspectionReportDetail.quantityByPack
      ) {
        errorInspectionReportDetail.push(inspectionReportDetail);
      }
    });
    if (errorInspectionReportDetail.length > 0) {
      throw new CustomValidationException(
        400,
        'Approved + defect quantity must equal to quantity by pack',
        errorInspectionReportDetail,
      );
    }
  }

  async isInspectionRequestHasInspectionReport(inspectionRequestId: string) {
    const inspectionReport =
      await this.prismaService.inspectionReport.findFirst({
        where: {
          inspectionRequestId,
        },
      });

    return inspectionReport ? true : false;
  }

  async create(dto: CreateInspectionReportDto) {
    if (
      await this.isInspectionRequestHasInspectionReport(dto.inspectionRequestId)
    ) {
      throw new ConflictException(
        'Inspection report for this inspection request already exists',
      );
    }
    await this.mapInspectionReportByImportRequest(dto);
    const inspectionReportCreateInput: Prisma.InspectionReportCreateInput = {
      code: dto.code,
      inspectionRequest: dto.inspectionRequestId
        ? {
            connect: {
              id: dto.inspectionRequestId,
            },
          }
        : undefined,
      inspectionReportDetail: {
        createMany: {
          data: { ...dto.inspectionReportDetail },
        },
      },
    };

    const importRequestId =
      await this.prismaService.inspectionRequest.findFirst({
        where: {
          id: dto.inspectionRequestId,
        },
      });

    let importRequestPromise = undefined;
    if (importRequestId) {
      importRequestPromise = this.prismaService.importRequest.update({
        where: {
          id: importRequestId.importRequestId,
        },
        data: {
          status: $Enums.ImportRequestStatus.INSPECTED,
        },
      });
    }

    const [data, inspectionRequest, importRequest] =
      await this.prismaService.$transaction([
        this.prismaService.inspectionReport.create({
          data: inspectionReportCreateInput,
          include: inspectionReportInclude,
        }),
        this.prismaService.inspectionRequest.update({
          where: {
            id: dto.inspectionRequestId,
          },
          data: {
            status: $Enums.InspectionRequestStatus.INSPECTED,
          },
        }),
        importRequestPromise,
      ]);

    return {
      ...data,
      inspectionRequestStatus: inspectionRequest?.status,
      importRequestStatus: importRequest?.status,
    };
  }

  async update(id: string, dto: UpdateInspectionReportDto) {
    // Extract the IDs of the details to be updated
    const detailIds = dto.inspectionReportDetail
      ?.filter((detail) => detail.id)
      .map((detail) => detail.id);

    const inspectionReportUpdateInput: Prisma.InspectionReportUpdateInput = {
      code: dto.code,
      // inspectionDepartment: dto.inspectionDepartmentId
      //   ? {
      //       connect: {
      //         id: dto.inspectionDepartmentId,
      //       },
      //     }
      //   : undefined,
      inspectionRequest: {
        connect: {
          id: dto.inspectionRequestId,
        },
      },
      inspectionReportDetail: dto.inspectionReportDetail
        ? {
            upsert: dto.inspectionReportDetail.map((detail) => ({
              where: {
                id: detail.id,
              }, // Use a non-existent UUID if undefined or empty
              deleteMany: {
                id: {
                  notIn: detailIds,
                },
              },
              update: {
                approvedQuantityByPack: detail.approvedQuantityByPack,
                defectQuantityByPack: detail.defectQuantityByPack,
                quantityByPack: detail.quantityByPack,
                materialPackageId: detail.materialPackageId,
                productSizeId: detail.productSizeId,
              },
              create: {
                approvedQuantityByPack: detail.approvedQuantityByPack,
                defectQuantityByPack: detail.defectQuantityByPack,
                quantityByPack: detail.quantityByPack,
                materialPackageId: detail.materialPackageId,
                productSizeId: detail.productSizeId,
              },
            })),
          }
        : undefined,
    };

    return this.prismaService.inspectionReport.update({
      where: { id },
      data: inspectionReportUpdateInput,
      include: inspectionReportInclude,
    });
  }

  remove(id: string) {
    return this.prismaService.inspectionReport.delete({
      where: { id },
    });
  }
}

export const inspectionReportInclude: Prisma.InspectionReportInclude = {
  inspectionRequest: {
    include: {
      importRequest: {
        include: importRequestInclude,
      },
      inspectionDepartment: true,
      purchasingStaff: true,
    },
  },

  inspectionReportDetail: {
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
