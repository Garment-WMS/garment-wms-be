import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  ProductionBatch,
  ProductionBatchStatus,
  ProductVariant,
} from '@prisma/client';
import { isUUID } from 'class-validator';
import {
  importRequestInclude,
  productionBatchInclude,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { getPageMeta } from 'src/common/utils/utils';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { ExcelService } from '../excel/excel.service';
import { CreateImportRequestDetailDto } from '../import-request/dto/import-request-detail/create-import-request-detail.dto';
import { ProductPlanDetailService } from '../product-plan-detail/product-plan-detail.service';
import { ProductionBatchMaterialVariantService } from '../production-batch-material-variant/production-batch-material-variant.service';
import { CancelProductBatchDto } from './dto/cancel-product-batch.dto';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';

type ProductionBatchWithInclude = Prisma.ProductionBatchGetPayload<{
  include: typeof productionBatchInclude;
}> & { numberOfProducedProduct: number };
type ImportRequestWithInclude = Prisma.ImportRequestGetPayload<{
  include: typeof importRequestInclude;
}>;

export type totalProductSizeProduced = {
  productVariant: ProductVariant;
  producedQuantity: number;
  defectQuantity: number;
};

@Injectable()
export class ProductionBatchService {
  constructor(
    readonly prismaService: PrismaService,
    private readonly excelService: ExcelService,
    private readonly productPlanDetailService: ProductPlanDetailService,
    private readonly productionBatchMaterialVariantService: ProductionBatchMaterialVariantService,
  ) {}
  async findChart(chartDto: string) {
    const productionPlan = await this.prismaService.productionPlan.findFirst({
      where: {
        id: chartDto,
      },
    });
    // const { year } = chartDto;
    const monthlyData = [];
    let qualityRate = 0;
    let totalDefectProduct = 0;
    let totalProducedProduct = 0;
    let totalProductVariantProduced: totalProductSizeProduced[] = [];

    // for (let month = 0; month < 12; month++) {
    let numberOfProducedProduct = 0;
    let numberOfDefectProduct = 0;
    // const year = productionPlan.startDate.getFullYear();
    // const endYear = productionPlan.expectedEndDate.getFullYear();
    // const from = new Date(year, month, 1);
    // const to = new Date(endYear, month + 1, 0, 23, 59, 59, 999);
    const productionBatch = await this.prismaService.productionBatch.findMany({
      where: {
        AND: {
          productionPlanDetail: {
            productionPlanId: chartDto ? chartDto : null,
          },
          // createdAt: {
          //   gte: from,
          //   lte: to,
          // },
          status: {
            in: [ProductionBatchStatus.FINISHED],
          },
        },
      },
      include: {
        importRequest: {
          include: {
            inspectionRequest: {
              include: {
                inspectionReport: {
                  include: {
                    importReceipt: {
                      include: {
                        productReceipt: {
                          include: {
                            productSize: {
                              include: {
                                productVariant: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    productionBatch.forEach((batch) => {
      batch.importRequest.forEach((request) => {
        request.inspectionRequest.forEach((inspectionRequest) => {
          if (inspectionRequest.inspectionReport) {
            if (
              inspectionRequest.inspectionReport?.importReceipt &&
              inspectionRequest.inspectionReport.importReceipt.status ===
                'IMPORTED'
            ) {
              inspectionRequest.inspectionReport.importReceipt.productReceipt.forEach(
                (productReceipt) => {
                  if (productReceipt.isDefect) {
                    totalProductVariantProduced.push({
                      productVariant: productReceipt.productSize.productVariant,
                      producedQuantity: 0,
                      defectQuantity: productReceipt.isDefect
                        ? productReceipt.quantityByUom
                        : 0,
                    });
                    numberOfDefectProduct += productReceipt.quantityByUom;
                    totalDefectProduct += productReceipt.quantityByUom;
                  } else {
                    totalProductVariantProduced.push({
                      productVariant: productReceipt.productSize.productVariant,
                      producedQuantity: productReceipt.quantityByUom,
                      defectQuantity: productReceipt.isDefect
                        ? productReceipt.quantityByUom
                        : 0,
                    });
                    totalProducedProduct += productReceipt.quantityByUom;
                    numberOfProducedProduct += productReceipt.quantityByUom;
                  }
                },
              );
            }
          }
        });
      });
    });
    let totalProductSizeProducedArray = totalProductVariantProduced.reduce(
      (acc, productVariantProduced) => {
        const productVariantId = productVariantProduced.productVariant.id;
        if (!acc[productVariantId]) {
          acc[productVariantId] = {
            productVariant: productVariantProduced.productVariant,
            producedQuantity: 0,
            defectQuantity: 0,
          };
        }
        acc[productVariantId].producedQuantity +=
          productVariantProduced.producedQuantity;
        acc[productVariantId].defectQuantity +=
          productVariantProduced.defectQuantity;
        return acc;
      },
      {},
    );
    totalProductSizeProducedArray = Object.values(
      totalProductSizeProducedArray,
    );

    qualityRate =
      totalProducedProduct / (totalProducedProduct + totalDefectProduct);
    return apiSuccess(
      HttpStatus.OK,
      {
        // monthlyData,
        qualityRate,
        totalDefectProduct,
        totalProducedProduct,
        totalProductVariantProduced: totalProductSizeProducedArray,
      },
      'Chart data fetched successfully',
    );
  }

  async cancelProductionBatch(
    id: string,
    user: AuthenUser,
    cancelProductBatchDto: CancelProductBatchDto,
  ) {
    const productBatch = await this.findById(id);
    if (productBatch.status === 'CANCELLED') {
      throw new BadRequestException('Production Batch is already cancelled');
    }
    if (productBatch.status === 'FINISHED') {
      throw new BadRequestException('Production Batch is already finished');
    }
    if (productBatch.status === 'IMPORTING') {
      throw new BadRequestException('Production Batch is importing');
    }
    if (productBatch.status === 'EXECUTING') {
      throw new BadRequestException(
        'Production Batch is waiting for imported material',
      );
    }
    if (productBatch.status === 'MANUFACTURING') {
      throw new BadRequestException('Production Batch is manufacturing');
    }
    if (productBatch.status !== 'PENDING') {
      throw new BadRequestException('Production Batch is not pending');
    }

    console.log('user', user.productionDepartmentId);
    const result = await this.prismaService.productionBatch.update({
      where: { id: id },
      data: {
        status: ProductionBatchStatus.CANCELLED,
        cancelledReason: cancelProductBatchDto.cancelledReason,
        cancelledAt: new Date(),
        cancelledBy: user.productionDepartmentId,
      },
    });
    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Production Batch cancelled successfully',
      );
    }
    return apiFailed(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Failed to cancel Production Batch',
    );
  }

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
    // }
    //   throw new BadRequestException(
    //     'Production Batch is waiting for exported material',
    //   );
    if (productionBatch.status === 'EXECUTING') {
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
    if (productionBatch.status === 'CANCELLED') {
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
    Logger.log(excelData);
    console.log(excelData);
    // throw new BadRequestException('Method not implemented.');
    const createProductBatchData = excelData as CreateProductionBatchDto;
    const createProductionBatchInput: any = createProductBatchData;

    const isExceedQuantityPlanDetail =
      await this.productPlanDetailService.IsExceedQuantityPlanDetail(
        createProductionBatchInput.productionPlanDetailId,
        createProductionBatchInput.quantityToProduce,
      );
    if (isExceedQuantityPlanDetail) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Exceed quantity to produce in plan detail, you can not create this production batch',
      );
    }
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const productionBatchInput: Prisma.ProductionBatchCreateInput = {
          productionPlanDetail: {
            connect: {
              id: createProductionBatchInput.productionPlanDetailId,
            },
          },
          code: undefined,
          name: createProductionBatchInput.name,
          description: createProductionBatchInput.description,
          quantityToProduce: createProductionBatchInput.quantityToProduce,
          status: ProductionBatchStatus.PENDING,
        };
        // throw new Error('Method not implemented.');

        const productionBatchResult =
          await prismaInstance.productionBatch.create({
            data: productionBatchInput,
            // include: productionBatchInclude,
          });
        console.log(productionBatchResult);
        if (productionBatchResult) {
          await this.productionBatchMaterialVariantService.createMany(
            productionBatchResult.id,
            createProductBatchData.productionBatchMaterials,
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
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const data: any = (await this.prismaService.productionBatch.findFirst({
      where: { id },
      include: productionBatchInclude,
    })) as ProductionBatchWithInclude;
    data.numberOfProducedProduct = 0;
    data?.importRequest.forEach((request: ImportRequestWithInclude) => {
      if (request.inspectionRequest) {
        request.inspectionRequest.forEach((inspectionRequest: any) => {
          if (inspectionRequest.inspectionReport) {
            if (
              inspectionRequest.inspectionReport?.importReceipt &&
              inspectionRequest.inspectionReport.importReceipt.status ===
                'IMPORTED'
            ) {
              data.numberOfProducedProduct =
                inspectionRequest.inspectionReport.importReceipt.productReceipt.reduce(
                  (acc, current) => acc + current.quantityByUom,
                  0,
                );
            }
          }
        });
      }
    });
    let actualExportMateiralQuantity = [];
    data?.materialExportRequest?.forEach((request: any) => {
      if (request?.materialExportReceipt) {
        request.materialExportReceipt.materialExportReceiptDetail.forEach(
          (detail: any) => {
            actualExportMateiralQuantity.push({
              materialVariantId:
                detail.materialReceipt.materialPackage.materialVariantId,
              quantity:
                detail.quantityByPack *
                detail.materialReceipt.materialPackage.uomPerPack,
            });
          },
        );
      }
    });
    function groupByMaterialVariantId(materials) {
      const grouped = materials.reduce((acc, material) => {
        if (!acc[material.materialVariantId]) {
          acc[material.materialVariantId] = { ...material };
        } else {
          acc[material.materialVariantId].quantity += material.quantity;
        }
        return acc;
      }, {});

      return Object.values(grouped);
    }

    const groupedMaterials: any = groupByMaterialVariantId(
      actualExportMateiralQuantity,
    );

    data.productionBatchMaterialVariant.forEach((materialVariant) => {
      const foundMaterial = groupedMaterials.find(
        (groupedMaterial) =>
          groupedMaterial.materialVariantId ===
          materialVariant.materialVariantId,
      );
      if (foundMaterial) {
        materialVariant.actualExportQuantity = foundMaterial.quantity;
      }
    });

    if (!data) {
      throw new NotFoundException('Production batch not found');
    }
    return data;
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const data = (await this.prismaService.productionBatch.findFirst({
      where: { id },
      include: productionBatchInclude,
    })) as ProductionBatchWithInclude;
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
