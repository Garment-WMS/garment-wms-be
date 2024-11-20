import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { productionBatchInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { getPageMeta } from 'src/common/utils/utils';
import { ExcelService } from '../excel/excel.service';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';

@Injectable()
export class ProductionBatchService {
  constructor(
    readonly prismaService: PrismaService,
    private readonly excelService: ExcelService,
  ) {}
  async create(createProductionBatchDto: CreateProductionBatchDto) {
    const productionBatchInput: Prisma.ProductionBatchCreateInput = {
      ...createProductionBatchDto,
    };
    return this.prismaService.productionBatch.create({
      data: productionBatchInput,
    });
  }

  async createProductBatchWithExcelFile(
    file: Express.Multer.File,
    productionDepartmentId: string,
  ) {
    const excelData = await this.excelService.readProductionBatchExcel(file);
    if (excelData instanceof ApiResponse) {
      return excelData;
    }

    const createProductBatchData = excelData as CreateProductionBatchDto[];

    const createProductionBatchInput: Prisma.ProductionBatchCreateManyInput[] =
      createProductBatchData.map((item) => {
        return {
          ...item,
          productionDepartmentId,
          
        };
      });
    console.log(createProductionBatchInput);
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const productionBatchResult: any =
          await prismaInstance.productionBatch.createManyAndReturn({
            data: createProductBatchData,
          });
        return productionBatchResult;
      },
    );

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product Plan created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Product Plan');
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
