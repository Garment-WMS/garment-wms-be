import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import {
  importRequestInclude,
  inspectionReportInclude,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { CustomValidationException } from 'src/common/filter/custom-validation.exception';
import { getPageMeta } from 'src/common/utils/utils';
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
        include: {
          importRequest: true,
        },
      });

    if (!inspectionRequest) {
      return null;
    }

    const result = await this.prismaService.inspectionReport.findFirst({
      where: {
        inspectionRequestId: inspectionRequest.id,
      },
      include: {
        inspectionRequest: {
          include: {
            importRequest: true,
            inspectionDepartment: true,
            purchasingStaff: true,
          },
        },
        inspectionReportDetail: true,
      },
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

  private mapInspectionReportDetail(
    dto: CreateInspectionReportDto,
    importRequest: Prisma.ImportRequestGetPayload<{
      include: typeof importRequestInclude;
    }>,
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
        if (
          inspectionReportDetail.approvedQuantityByPack +
            inspectionReportDetail.defectQuantityByPack !==
          importRequestDetail.quantityByPack
        ) {
          errorInspectionReportDetail.push(inspectionReportDetail);
        }
      });
    });
    //log all inspection report details
    Logger.log(
      `Inspection report details: ${JSON.stringify(
        dto.inspectionReportDetail,
      )}`,
    );
    if (errorInspectionReportDetail.length > 0) {
      throw new CustomValidationException(
        400,
        'Approved + defect quantity must equal to quantity by pack ',
        errorInspectionReportDetail,
      );
    }
  }

  async getImportRequestOfInspectionRequestOrThrow(
    inspectionRequestId: string,
  ) {
    const importRequest = await this.prismaService.importRequest.findFirst({
      where: {
        inspectionRequest: {
          some: {
            id: inspectionRequestId,
            deletedAt: null,
          },
        },
      },
      include: importRequestInclude,
    });

    if (!importRequest) {
      Logger.error(`Import request of inspection request not found`);
      throw new NotFoundException(
        'Import request of inspection request not found',
      );
    }
    return importRequest;
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
    //check inspection request valid
    if (
      await this.isInspectionRequestHasInspectionReport(dto.inspectionRequestId)
    ) {
      throw new ConflictException(
        'Inspection report for this inspection request already exists',
      );
    }
    const importRequest = await this.getImportRequestOfInspectionRequestOrThrow(
      dto.inspectionRequestId,
    );
    this.mapInspectionReportDetail(dto, importRequest);
    const inspectionReportCreateInput: Prisma.InspectionReportUncheckedCreateInput =
      {
        code: dto.code,
        inspectionRequestId: dto.inspectionRequestId,
      };
    const result = await this.prismaService.$transaction(
      async (
        prismaInstance: Omit<
          PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
          | '$connect'
          | '$disconnect'
          | '$on'
          | '$transaction'
          | '$use'
          | '$extends'
        >,
      ) => {
        const inspectionReport = await prismaInstance.inspectionReport.create({
          data: inspectionReportCreateInput,
          include: inspectionReportInclude,
        });
        const inspectionRequestStatusUpdated =
          await this.updateInspectionRequestStatusByInspectionRequestIdToInspected(
            inspectionReport.inspectionRequestId,
            prismaInstance,
          );
        const importRequestStatusUpdated =
          await this.updateImportRequestStatusByImportRequestIdToInspected(
            importRequest.id,
            prismaInstance,
          );
        return {
          inspectionReport,
          'inspectionRequest.status': inspectionRequestStatusUpdated.status,
          'importRequest.status': importRequestStatusUpdated.status,
        };
      },
    );
    return result;
  }

  async updateInspectionRequestStatusByInspectionRequestIdToInspected(
    inspectionRequestId: string,
    prismaInstance: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = prismaInstance || this.prismaService;
    return await prisma.inspectionRequest.update({
      where: {
        id: inspectionRequestId,
      },
      data: {
        status: $Enums.InspectionRequestStatus.INSPECTED,
      },
    });
  }

  async updateImportRequestStatusByImportRequestIdToInspected(
    importRequestId: string,
    prismaInstance: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = prismaInstance || this.prismaService;
    return await prisma.importRequest.update({
      where: {
        id: importRequestId,
      },
      data: {
        status: $Enums.ImportRequestStatus.INSPECTED,
      },
    });
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
