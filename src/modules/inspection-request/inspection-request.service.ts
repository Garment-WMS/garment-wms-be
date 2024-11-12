import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { importRequestInclude } from '../import-request/import-request.service';
import { inspectionReportInclude } from '../inspection-report/inspection-report.service';
import { CreateInspectionRequestDto } from './dto/create-inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/update-inspection-request.dto';

@Injectable()
export class InspectionRequestService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(
    findOptions: GeneratedFindOptions<Prisma.InspectionRequestWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.inspectionRequest.findMany({
        where: findOptions?.where,
        skip: offset,
        take: limit,
        include: inspectionRequestInclude,
      }),
      this.prismaService.inspectionRequest.count({
        where: findOptions?.where,
      }),
    ]);

    const dataResponse: DataResponse = {
      data: result,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async getStatistics(type?: $Enums.InspectionRequestType) {
    const [total, inspecting, inspected] =
      await this.prismaService.$transaction([
        this.prismaService.inspectionRequest.count({
          where: {
            type: type,
          },
        }),
        this.prismaService.inspectionRequest.count({
          where: {
            type: type,
            status: $Enums.InspectionRequestStatus.INSPECTING,
          },
        }),
        this.prismaService.inspectionRequest.count({
          where: {
            type: type,
            status: $Enums.InspectionRequestStatus.INSPECTED,
          },
        }),
      ]);

    return { total, inspecting, inspected };
  }

  private async getInspectionRequestTypeByImportRequestId(
    importRequestId: string,
  ) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      select: {
        type: true,
      },
      where: {
        id: importRequestId,
      },
    });

    if (!importRequest)
      throw new ConflictException(
        `Get Inspection Request Type failed because Import Request Id ${importRequestId} not found`,
      );

    if (importRequest.type.toString().startsWith('PRODUCT')) {
      return $Enums.InspectionRequestType.PRODUCT;
    } else {
      return $Enums.InspectionRequestType.MATERIAL;
    }
  }

  async create(
    createInspectionRequestDto: CreateInspectionRequestDto,
    prismaClient?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const inspectionRequestCreateInput: Prisma.InspectionRequestCreateInput = {
      importRequest: {
        connect: {
          id: createInspectionRequestDto.importRequestId,
        },
      },
      inspectionDepartment: {
        connect: {
          id: createInspectionRequestDto.inspectionDepartmentId,
        },
      },
      purchasingStaff: createInspectionRequestDto.purchasingStaffId
        ? {
            connect: {
              id: createInspectionRequestDto.purchasingStaffId,
            },
          }
        : undefined,
      warehouseManager: createInspectionRequestDto.warehouseManagerId
        ? {
            connect: {
              id: createInspectionRequestDto.warehouseManagerId,
            },
          }
        : undefined,
      status: createInspectionRequestDto.status,
      note: createInspectionRequestDto.note,
      code: undefined,
      type: await this.getInspectionRequestTypeByImportRequestId(
        createInspectionRequestDto.importRequestId,
      ),
    };
    const [inspectionRequest, importRequest] =
      await this.prismaService.$transaction([
        this.prismaService.inspectionRequest.create({
          data: inspectionRequestCreateInput,
          include: inspectionRequestInclude,
        }),
        this.prismaService.importRequest.update({
          where: {
            id: createInspectionRequestDto.importRequestId,
          },
          data: {
            status: $Enums.ImportRequestStatus.INSPECTING,
          },
        }),
      ]);
    return inspectionRequest;
  }

  async findAll() {
    return this.prismaService.inspectionRequest.findMany();
  }

  async findUnique(id: string) {
    const inspectionRequest =
      await this.prismaService.inspectionRequest.findUnique({
        where: {
          id: id,
        },
        include: inspectionRequestInclude,
      });
    if (!inspectionRequest)
      throw new NotFoundException(`Inspection Request with id ${id} not found`);
    return inspectionRequest;
  }

  async findFirst(id: string) {
    const inspectionRequest = this.prismaService.inspectionRequest.findFirst({
      where: {
        id: id,
      },
      include: inspectionRequestInclude,
    });
    return inspectionRequest;
  }

  async getEnum() {
    return {
      InspectionRequestStatus: $Enums.InspectionRequestStatus,
      InspectionRequestType: $Enums.InspectionRequestType,
    };
  }

  async update(
    id: string,
    updateInspectionRequestDto: UpdateInspectionRequestDto,
  ) {
    const inspectionRequestUpdateInput: Prisma.InspectionRequestUpdateInput = {
      status: updateInspectionRequestDto.status,
      note: updateInspectionRequestDto.note,
    };

    if (updateInspectionRequestDto.importRequestId) {
      inspectionRequestUpdateInput.importRequest = {
        connect: {
          id: updateInspectionRequestDto.importRequestId,
        },
      };
    }

    if (updateInspectionRequestDto.inspectionDepartmentId) {
      inspectionRequestUpdateInput.inspectionDepartment = {
        connect: {
          id: updateInspectionRequestDto.inspectionDepartmentId,
        },
      };
    }

    if (updateInspectionRequestDto.purchasingStaffId) {
      inspectionRequestUpdateInput.purchasingStaff = {
        connect: {
          id: updateInspectionRequestDto.purchasingStaffId,
        },
      };
    }

    const inspectionRequest = await this.prismaService.inspectionRequest.update(
      {
        where: {
          id: id,
        },
        data: inspectionRequestUpdateInput,
        include: inspectionRequestInclude,
      },
    );
    return inspectionRequest;
  }

  async remove(id: string) {
    return this.prismaService.inspectionRequest.delete({
      where: {
        id: id,
      },
    });
  }
}

export const inspectionRequestInclude: Prisma.InspectionRequestInclude = {
  importRequest: {
    include: importRequestInclude,
  },
  inspectionDepartment: {
    include: {
      account: true,
    },
  },
  purchasingStaff: {
    include: {
      account: true,
    },
  },
  inspectionReport: {
    include: inspectionReportInclude,
  },
};
