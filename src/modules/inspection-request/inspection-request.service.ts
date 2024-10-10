import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
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
        include: this.inspectionRequestInclude,
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

  async create(createInspectionRequestDto: CreateInspectionRequestDto) {
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
      purchasingStaff: {
        connect: {
          id: createInspectionRequestDto.purchasingStaffId,
        },
      },
      inspectionReport: {
        connect: {
          id: createInspectionRequestDto.importRequestId,
        },
      },
      status: createInspectionRequestDto.status,
      note: createInspectionRequestDto.note,
    };

    const inspectionRequest = await this.prismaService.inspectionRequest.create(
      {
        data: inspectionRequestCreateInput,
        include: this.inspectionRequestInclude,
      },
    );
    return inspectionRequest;
  }

  async findAll() {
    return this.prismaService.inspectionRequest.findMany();
  }

  async findUnique(id: string) {
    const inspectionRequest = this.prismaService.inspectionRequest.findUnique({
      where: {
        id: id,
      },
      include: this.inspectionRequestInclude,
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
      include: this.inspectionRequestInclude,
    });
    return inspectionRequest;
  }

  async update(
    id: string,
    updateInspectionRequestDto: UpdateInspectionRequestDto,
  ) {
    const inspectionRequestUpdateInput: Prisma.InspectionRequestUpdateInput = {
      importRequest: {
        connect: {
          id: updateInspectionRequestDto.importRequestId,
        },
      },
      inspectionDepartment: {
        connect: {
          id: updateInspectionRequestDto.inspectionDepartmentId,
        },
      },
      purchasingStaff: {
        connect: {
          id: updateInspectionRequestDto.purchasingStaffId,
        },
      },
      inspectionReport: {
        connect: {
          id: updateInspectionRequestDto.importRequestId,
        },
      },
      status: updateInspectionRequestDto.status,
      note: updateInspectionRequestDto.note,
    };

    const inspectionRequest = await this.prismaService.inspectionRequest.update(
      {
        where: {
          id: id,
        },
        data: inspectionRequestUpdateInput,
        include: this.inspectionRequestInclude,
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

  public inspectionRequestInclude: Prisma.InspectionRequestInclude = {
    importRequest: true,
    inspectionDepartment: true,
    purchasingStaff: true,
    inspectionReport: true,
  };
}
