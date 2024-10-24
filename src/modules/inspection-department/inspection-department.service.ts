import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundError } from 'rxjs';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';

@Injectable()
export class InspectionDepartmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(
    findOptions: GeneratedFindOptions<Prisma.InspectionDepartmentWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.inspectionDepartment.findMany({
        where: findOptions?.where,
        skip: offset,
        take: limit,
        include: inspectionDepartmentInclude,
      }),
      this.prismaService.inspectionDepartment.count({
        where: findOptions?.where,
      }),
    ]);

    const dataResponse: DataResponse = {
      data: data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return dataResponse;
  }

  findAll() {
    return this.prismaService.inspectionDepartment.findMany();
  }

  findUnique(id: string) {
    const data = this.prismaService.inspectionDepartment.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundError(`Inspection Department with ID ${id} not found`);
    }
    return data;
  }

  async findFirst(id: string) {
    return this.prismaService.inspectionDepartment.findFirst({
      where: { id },
    });
  }

  remove(id: string) {
    return this.prismaService.inspectionDepartment.delete({
      where: { id },
    });
  }
}

export const inspectionDepartmentInclude: Prisma.InspectionDepartmentInclude = {
  account: true,
  _count: {
    select: {
      inspectionRequest: {
        where: {
          status: {
            equals: $Enums.InspectionRequestStatus.INSPECTING,
          },
          deletedAt: {
            equals: null,
          },
        },
      },
    },
  },
};
