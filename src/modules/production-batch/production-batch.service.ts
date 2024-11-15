import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { productionBatchInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';

@Injectable()
export class ProductionBatchService {
  constructor(readonly prismaService: PrismaService) {}
  async create(createProductionBatchDto: CreateProductionBatchDto) {
    const productionBatchInput: Prisma.ProductionBatchCreateInput = {
      ...createProductionBatchDto,
    };
    return this.prismaService.productionBatch.create({
      data: productionBatchInput,
    });
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.ProductionBatchWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productionBatch.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: productionBatchInclude,
      }),
      this.prismaService.productionBatch.count({
        where: findOptions?.where,
      }),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async findAll() {
    return this.prismaService.productionBatch.findMany();
  }

  async findUnique(id: string) {
    const data = await this.prismaService.productionBatch.findFirst({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('Production batch not found');
    }
    return data;
  }

  async findFirst(id: string) {
    return this.prismaService.productionBatch.findFirst({
      where: { id },
    });
  }

  async update(id: string, updateProductionBatchDto: UpdateProductionBatchDto) {
    const updateProductionBatchInput: Prisma.ProductionBatchUpdateInput = {
      ...updateProductionBatchDto,
    };
    const result = await this.prismaService.productionBatch.update({
      where: {
        id: id,
      },
      data: updateProductionBatchInput,
    });
    return result;
  }

  async remove(id: string) {
    return this.prismaService.productionBatch.delete({
      where: {
        id: id,
      },
    });
  }
}
