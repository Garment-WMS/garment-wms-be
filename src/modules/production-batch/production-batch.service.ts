import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { productionBatchInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ExcelService } from '../excel/excel.service';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';

@Injectable()
export class ProductionBatchService {
  createProductionBatchWithExcelFile( // async createProductPlanWithExcelFile(
    file: any,
    productionDepartmentId: string,
  ): any {
    throw new Error('Method not implemented.');
  }
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

  // async createProductionBatchWithExcelFile(
  //   file: any,
  //   productionDepartmentId: string,
  // ) {
  //   const excelData = await this.excelService.readProductionBatchExcel(file);
  //   if (excelData instanceof ApiResponse) {
  //     return excelData;
  //   }

  //   const createProductPlanData = excelData as CreateProductPlanDto;
  // }

  // async createProductPlanWithExcelFile(
  //   file: Express.Multer.File,
  //   factoryDirectorId: string,
  // ) {
  //   const excelData = await this.excelService.readProductionPlanExcel(file);
  //   if (excelData instanceof ApiResponse) {
  //     return excelData;
  //   }

  //   const createProductPlanData = excelData as CreateProductPlanDto;
  //   const productPlanInput: Prisma.ProductionPlanCreateInput = {
  //     factoryDirector: {
  //       connect: { id: factoryDirectorId },
  //     },
  //     name: createProductPlanData.name,
  //     note: createProductPlanData.note,
  //     expectedStartDate: createProductPlanData.expectedStartDate,
  //     expectedEndDate: createProductPlanData.expectedEndDate,
  //     code: undefined,
  //   };
  //   const result = await this.prismaService.$transaction(
  //     async (prismaInstance: PrismaClient) => {
  //       const productionPlanResult: any =
  //         await prismaInstance.productionPlan.create({
  //           data: productPlanInput,
  //         });

  //       const productPlanItems =
  //         createProductPlanData.productionPlanDetails.map((item) => {
  //           const { code, ...rest } = item; // Remove the 'code' field
  //           return {
  //             ...rest,
  //             productionPlanId: productionPlanResult.id,
  //           };
  //         });
  //       const productionPlanDetail =
  //         await this.productPlanDetailService.createMany(
  //           productPlanItems,
  //           prismaInstance,
  //         );

  //       productionPlanResult.productionPlanDetails = productionPlanDetail;

  //       return productionPlanResult;
  //     },
  //   );

  //   if (result) {
  //     return apiSuccess(
  //       HttpStatus.CREATED,
  //       result,
  //       'Product Plan created successfully',
  //     );
  //   }
  //   return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Product Plan');
  // }

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
