import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductionBatch, ProductionBatchStatus } from '@prisma/client';
import { productionBatchInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { getPageMeta } from 'src/common/utils/utils';
import { ExcelService } from '../excel/excel.service';
import { CreateImportRequestDetailDto } from '../import-request/dto/import-request-detail/create-import-request-detail.dto';
import { ProductPlanDetailService } from '../product-plan-detail/product-plan-detail.service';
import { ProductionBatchMaterialVariantService } from '../production-batch-material-variant/production-batch-material-variant.service';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';

@Injectable()
export class ProductionBatchService {
  constructor(
    readonly prismaService: PrismaService,
    private readonly excelService: ExcelService,
    private readonly productPlanDetailService: ProductPlanDetailService,
    private readonly productionBatchMaterialVariantService: ProductionBatchMaterialVariantService,
  ) {}

  updateProductBatchStatus(
    productionBatchId: string,
    status: ProductionBatchStatus,
    prismaInstance: PrismaService,
  ) {
    return prismaInstance.productionBatch.update({
      where: { id: productionBatchId },
      data: {
        status: status,
      },
    });
  }

  updateStatus(
    productionBatchId: string,
    status: ProductionBatchStatus,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const productionBatchInput: Prisma.ProductionBatchUpdateInput = {
      status: status,
    };
    return prismaInstance.productionBatch.update({
      where: { id: productionBatchId },
      data: productionBatchInput,
    });
  }

  async checkIsProductionBatchValid(
    productionBatch: ProductionBatch,
    importRequestDetails: CreateImportRequestDetailDto,
  ) {
    throw new Error('Method not implemented.');
  }

  async create(createProductionBatchDto: CreateProductionBatchDto) {
    const productionBatchInput: Prisma.ProductionBatchCreateInput = {
      ...createProductionBatchDto,
    };
    return this.prismaService.productionBatch.create({
      data: productionBatchInput,
    });
  }

  async chekIsProductionBatchStatus(productionBatchId: string) {
    const productionBatch = await this.findUnique(productionBatchId);

    if (!productionBatch) {
      throw new NotFoundException('Production Batch not found');
    }
    if (productionBatch.status === 'MANUFACTURING') {
      return;
    }
    // if (productionBatch.status === 'WAITING_FOR_EXPORTING_MATERIAL') {
    //   throw new BadRequestException(
    //     'Production Batch is waiting for exported material',
    //   );
    // }
    if (productionBatch.status === 'WAITING_FOR_EXPORTING_MATERIAL') {
      throw new BadRequestException(
        'Production Batch is waiting for imported material',
      );
    }

    if (productionBatch.status === 'IMPORTING') {
      throw new BadRequestException('Production Batch is importing');
    }
    // if (productionBatch.status === 'IMPORTED') {
    //   throw new BadRequestException('Production Batch is imported');
    // }
    if (productionBatch.status === 'FINISHED') {
      throw new BadRequestException('Production Batch is finished');
    }
    if (productionBatch.status === 'CANCELED') {
      throw new BadRequestException('Production Batch is finished');
    }
    return productionBatch;
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
        };
      });

    const isExceedQuantityPlanDetail =
      await this.productPlanDetailService.IsExceedQuantityPlanDetail(
        createProductionBatchInput[0].productionPlanDetailId,
        createProductionBatchInput[0].quantityToProduce,
      );
    if (isExceedQuantityPlanDetail) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Exceed quantity to produce in plan detail, you can not create this production batch',
      );
    }
    console.log(createProductionBatchInput[0]);

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const productionBatchInput: Prisma.ProductionBatchCreateInput = {
          productionPlanDetail: {
            connect: {
              id: createProductionBatchInput[0].productionPlanDetailId,
            },
          },
          code: createProductionBatchInput[0].code,
          name: createProductionBatchInput[0].name,
          description: createProductionBatchInput[0].description,
          quantityToProduce: createProductionBatchInput[0].quantityToProduce,
          status: 'EXECUTING',
        };
        // throw new Error('Method not implemented.');

        const productionBatchResult =
          await prismaInstance.productionBatch.create({
            data: productionBatchInput,
            // include: productionBatchInclude,
          });
        if (productionBatchResult) {
          await this.productionBatchMaterialVariantService.createMany(
            productionBatchResult.id,
            createProductBatchData[0].productionBatchMaterials,
            prismaInstance,
          );
        }
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
    return this.prismaService.productionBatch.findMany({
      include: productionBatchInclude,
    });
  }

  async findUnique(id: string) {
    const data = await this.prismaService.productionBatch.findFirst({
      where: { id },
      include: productionBatchInclude,
    });
    if (!data) {
      throw new NotFoundException('Production batch not found');
    }
    return data;
  }

  async findFirst(id: string) {
    return this.prismaService.productionBatch.findFirst({
      where: { id },
      include: productionBatchInclude,
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
      include: productionBatchInclude,
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
