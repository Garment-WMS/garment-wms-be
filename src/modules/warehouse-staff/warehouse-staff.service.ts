import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { warehouseStaffInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundError } from 'rxjs';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';

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
