import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
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
import { ApiResponse } from 'src/common/dto/response.dto';
import { CustomHttpException } from 'src/common/filter/custom-http.exception';
import { CustomValidationException } from 'src/common/filter/custom-validation.exception';
import { getPageMeta } from 'src/common/utils/utils';
import { CreateImportReceiptDto } from '../import-receipt/dto/create-import-receipt.dto';
import { ImportReceiptService } from '../import-receipt/import-receipt.service';
import { TaskService } from '../task/task.service';
import { CreateInspectionReportDetailDto } from './dto/inspection-report-detail/create-inspection-report-detail.dto';
import { CreateInspectionReportDto } from './dto/inspection-report/create-inspection-report.dto';
import { UpdateInspectionReportDto } from './dto/inspection-report/update-inspection-report.dto';

@Injectable()
export class InspectionReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly taskService: TaskService,
    private readonly importReceiptService: ImportReceiptService,
    // private readonly importRequestService: ImportRequestService,
  ) {}

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

  async findFirst(id: string) {
    return await this.prismaService.inspectionReport.findFirst({
      where: { id: id },
      include: inspectionReportInclude,
    });
  }

  private checkImportRequestDetailAreInInspectionReportDetail(
    dto: CreateInspectionReportDto,
    importRequest: Prisma.ImportRequestGetPayload<{
      include: typeof importRequestInclude;
    }>,
  ) {
    let importRequestDetailItemIdSet: Set<string>;
    let inspectionReportDetailItemSet: Set<string>;

    // Initialize sets based on the type of inspection report
    switch (dto.type) {
      case $Enums.InspectionReportType.MATERIAL:
        importRequestDetailItemIdSet = new Set(
          importRequest.importRequestDetail.map(
            (detail) => detail.materialPackageId,
          ),
        );
        inspectionReportDetailItemSet = new Set(
          dto.inspectionReportDetail.map((detail) => detail.materialPackageId),
        );
        break;

      case $Enums.InspectionReportType.PRODUCT:
        importRequestDetailItemIdSet = new Set(
          importRequest.importRequestDetail.map(
            (detail) => detail.productSizeId,
          ),
        );
        inspectionReportDetailItemSet = new Set(
          dto.inspectionReportDetail.map((detail) => detail.productSizeId),
        );
        break;

      default:
        throw new BadRequestException('Invalid inspection report type');
    }

    // Find redundant and missing IDs
    const redundantIds: string[] = [];
    const missingIds: string[] = [];

    importRequestDetailItemIdSet.forEach((id) => {
      if (!inspectionReportDetailItemSet.has(id)) {
        redundantIds.push(id);
      }
    });

    inspectionReportDetailItemSet.forEach((id) => {
      if (!importRequestDetailItemIdSet.has(id)) {
        missingIds.push(id);
      }
    });

    // Throw an exception if there are any redundant or missing IDs
    if (missingIds.length > 0 || redundantIds.length > 0) {
      throw new CustomHttpException(
        400,
        new ApiResponse(400, null, 'Import request details must be inspected', {
          redundantIds,
          missingIds,
          importRequestDetail: importRequest.importRequestDetail,
        }),
      );
    }

    return dto;
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
          console.log(inspectionReportDetail.approvedQuantityByPack);
          console.log(inspectionReportDetail.defectQuantityByPack);
          console.log(importRequestDetail.quantityByPack);
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
    // console.log(errorInspectionReportDetail);
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

    this.checkImportRequestDetailAreInInspectionReportDetail(
      dto,
      importRequest,
    );
    this.mapInspectionReportDetail(dto, importRequest);

    //log inspection report detail
    dto.inspectionReportDetail.forEach((inspectionReportDetail) => {
      Logger.log(
        `Inspection report detail: ${JSON.stringify(inspectionReportDetail)}`,
      );
    });
    const inspectionReportCreateInput: Prisma.InspectionReportUncheckedCreateInput =
      {
        code: dto.code,
        inspectionRequestId: dto.inspectionRequestId,
        // inspectionReportDetail: {
        //   createMany: {
        //     data: dto.inspectionReportDetail.map((detail) => ({
        //       materialPackageId: detail.materialPackageId,
        //       productSizeId: detail.productSizeId,
        //       quantityByPack: detail.quantityByPack,
        //       approvedQuantityByPack: detail.approvedQuantityByPack,
        //       defectQuantityByPack: detail.defectQuantityByPack,
        //     })),
        //   },
        // },
      };
    let result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const inspectionReport = await prismaInstance.inspectionReport.create({
          data: inspectionReportCreateInput,
        });
        const inspectionReportDetails =
          await this.createInspectionReportDetails(
            dto.inspectionReportDetail,
            inspectionReport.id,
            prismaInstance,
          );
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
    result.inspectionReport = await this.findUnique(result.inspectionReport.id);
    //auto create import receipt
    const importReceipt = await this.createImportReceipt(
      {
        importRequestId: importRequest.id,
        type: importRequest.type.startsWith('MATERIAL')
          ? $Enums.ReceiptType.MATERIAL
          : $Enums.ReceiptType.PRODUCT,
        startAt: new Date(),
      },
      importRequest.warehouseManagerId,
    );
    return {
      ...result,
      importReceipt,
    };
  }

  async createInspectionReportDetails(
    dto: CreateInspectionReportDetailDto[],
    inspectionReportId: string,
    prismaInstance: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const input: Prisma.InspectionReportDetailUncheckedCreateInput[] = dto.map(
      (detail) => ({
        approvedQuantityByPack: detail.approvedQuantityByPack,
        defectQuantityByPack: detail.defectQuantityByPack,
        quantityByPack: detail.quantityByPack,
        materialPackageId: detail.materialPackageId,
        productSizeId: detail.productSizeId,
        inspectionReportId: inspectionReportId,
      }),
    );

    const prisma = prismaInstance || this.prismaService;

    // Create inspection report details
    const createdDetails =
      await prisma.inspectionReportDetail.createManyAndReturn({
        data: input,
        skipDuplicates: true,
      });

    // Create related inspection report detail defects
    for (const detail of dto) {
      if (detail.inspectionReportDetailDefect) {
        const createdDetail = createdDetails.find(
          (d) =>
            d.materialPackageId === detail.materialPackageId &&
            d.inspectionReportId === inspectionReportId,
        );

        if (createdDetail) {
          await prisma.inspectionReportDetailDefect.createMany({
            data: detail.inspectionReportDetailDefect.map((defect) => ({
              defectId: defect.defectId,
              quantityByPack: defect.quantityByPack,
              inspectionReportDetailId: createdDetail.id,
            })),
          });
        }
      }
    }

    return createdDetails;
  }

  async updateInspectionRequestStatusByInspectionRequestIdToInspected(
    inspectionRequestId: string,
    prismaInstance: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = prismaInstance || this.prismaService;
    await this.taskService.updateTaskStatusToDone({
      inspectionRequestId: inspectionRequestId,
    });
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
        // status: $Enums.ImportRequestStatus.APPROVED,
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

  async createImportReceipt(
    createImportReceiptDto: CreateImportReceiptDto,
    managerId: string,
  ) {
    switch (createImportReceiptDto.type) {
      case $Enums.ReceiptType.MATERIAL:
        return this.importReceiptService.createMaterialReceipt(
          createImportReceiptDto,
          managerId,
        );
      case $Enums.ReceiptType.PRODUCT:
        return this.importReceiptService.createProductReceipt(
          createImportReceiptDto,
          managerId,
        );
    }
  }

  remove(id: string) {
    return this.prismaService.inspectionReport.delete({
      where: { id },
    });
  }
}
