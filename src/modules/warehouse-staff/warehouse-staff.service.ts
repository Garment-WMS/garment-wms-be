import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundError } from 'rxjs';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { accountSelect } from '../inspection-department/inspection-department.service';

@Injectable()
export class WarehouseStaffService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(
    findOptions: GeneratedFindOptions<Prisma.WarehouseStaffWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.warehouseStaff.findMany({
        where: findOptions?.where,
        skip: offset,
        take: limit,
        include: warehouseStaffInclude,
      }),
      this.prismaService.warehouseStaff.count({
        where: findOptions?.where,
      }),
    ]);

    const dataResponse: DataResponse = {
      data: data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return dataResponse;
  }

  async findAll() {
    return this.prismaService.warehouseStaff.findMany();
  }

  async findUnique(id: string) {
    const data = await this.prismaService.warehouseStaff.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundError(`Warehouse Staff with ID ${id} not found`);
    }
    return data;
  }

  async findFirst(id: string) {
    return this.prismaService.warehouseStaff.findFirst({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prismaService.warehouseStaff.delete({
      where: { id },
    });
  }
}

export const warehouseStaffInclude: Prisma.WarehouseStaffInclude = {
  account: {
    select: accountSelect,
  },
  _count: {
    select: {
      importRequest: {
        where: {
          inspectionRequest: {
            some: {
              inspectionReport: {
                importReceipt: {
                  status: $Enums.ImportReceiptStatus.IMPORTING,
                },
              },
            },
          },
        },
      },
      importReceipt: {
        where: {
          status: $Enums.ImportReceiptStatus.IMPORTING,
        },
      },
    },
  },
};

export const warehouseManagerInclude: Prisma.WarehouseStaffInclude = {
  account: {
    select: accountSelect,
  },
};

export const productionDepartmentInclude: Prisma.ProductionDepartmentInclude = {
  account: {
    select: accountSelect,
  },
};

export const factoryDirectorInclude: Prisma.FactoryDirectorInclude = {
  account: {
    select: accountSelect,
  },
};
