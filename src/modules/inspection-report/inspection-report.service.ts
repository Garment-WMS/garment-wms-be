import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta, nonExistUUID } from 'src/common/utils/utils';
import { CreateInspectionReportDto } from './dto/inspection-report/create-inspection-report.dto';
import { UpdateInspectionReportDto } from './dto/inspection-report/update-inspection-report.dto';

@Injectable()
export class InspectionReportService {
  constructor(private readonly prismaService: PrismaService) {}

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
        include: this.inspectionReportInclude,
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
        include: this.inspectionReportInclude,
      });
    if (!inspectionReport) {
      throw new NotFoundException('Inspection report not found');
    }
    return inspectionReport;
  }

  findFirst(id: string) {
    return this.prismaService.inspectionReport.findFirst({
      where: { id },
      include: this.inspectionReportInclude,
    });
  }

  create(dto: CreateInspectionReportDto) {
    const inspectionReportCreateInput: Prisma.InspectionReportCreateInput = {
      code: dto.code,
      inspectionRequest: dto.inspectionRequestId
        ? {
            connect: {
              id: dto.inspectionRequestId,
            },
          }
        : undefined,
      inspectionDepartment: dto.inspectionDepartmentId
        ? {
            connect: {
              id: dto.inspectionDepartmentId,
            },
          }
        : undefined,
      inspectionReportDetail: {
        createMany: {
          data: dto.inspectionReportDetail,
        },
      },
    };
    return this.prismaService.inspectionReport.create({
      data: inspectionReportCreateInput,
      include: this.inspectionReportInclude,
    });
  }

  async update(id: string, dto: UpdateInspectionReportDto) {
    // Extract the IDs of the details to be updated
    const detailIds = dto.inspectionReportDetail
      ?.filter((detail) => detail.id)
      .map((detail) => detail.id);

    const inspectionReportUpdateInput: Prisma.InspectionReportUpdateInput = {
      code: dto.code,
      inspectionDepartment: dto.inspectionDepartmentId
        ? {
            connect: {
              id: dto.inspectionDepartmentId,
            },
          }
        : undefined,
      inspectionRequest: {
        connect: {
          id: dto.inspectionRequestId,
        },
      },
      inspectionReportDetail: dto.inspectionReportDetail
        ? {
            upsert: dto.inspectionReportDetail.map((detail) => ({
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

    return this.prismaService.inspectionReport.update({
      where: { id },
      data: inspectionReportUpdateInput,
      include: this.inspectionReportInclude,
    });
  }

  remove(id: string) {
    return this.prismaService.inspectionReport.delete({
      where: { id },
    });
  }

  public inspectionReportInclude: Prisma.InspectionReportInclude = {
    inspectionRequest: {
      include: {
        importRequest: true,
        inspectionDepartment: true,
        purchasingStaff: true,
      },
    },
    inspectionDepartment: true,
    inspectionReportDetail: {
      include: {
        materialVariant: {
          include: {
            material: true,
          },
        },
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    },
  };
}
