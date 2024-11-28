import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, ProductReceiptStatus } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { isUUID } from 'class-validator';
import { productReceiptIncludeQuery } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { InventoryStockService } from '../inventory-stock/inventory-stock.service';
import { CreateProductReceiptDto } from './dto/create-product-receipt.dto';
import { UpdateProductReceiptDto } from './dto/update-product-receipt.dto';

@Injectable()
export class ProductReceiptService {
  updateAwaitStatus() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private prismaService: PrismaService,
    private readonly inventoryStockService: InventoryStockService,
  ) {}

  async updateProductReceiptQuantity(
    id: string,
    quantityByUom: number,
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    const productReceipt = await this.findById(id);
    if (!productReceipt) {
      throw new BadRequestException('Material Receipt not found');
    }
    return prismaInstance.$transaction(
      async (prismaInstance: PrismaService) => {
        await prismaInstance.productReceipt.update({
          where: {
            id,
          },
          data: {
            remainQuantityByUom: quantityByUom,
          },
        });

        const remainQuantityByUom = await this.getRemainQuantityByProductSize(
          productReceipt.productSizeId,
          prismaInstance,
        );

        await this.inventoryStockService.updateProductStockQuantity(
          productReceipt.productSizeId,
          remainQuantityByUom,
          prismaInstance,
        );
        return null;
      },
    );
  }
  async getRemainQuantityByProductSize(
    productSizeId: string,
    prismaInstance: PrismaService,
  ) {
    const productReceipts = await this.getAllProductReceiptOfProductSize(
      productSizeId,
      prismaInstance,
    );

    return productReceipts.reduce((acc, el) => {
      return acc + el.remainQuantityByUom;
    }, 0);
  }
  async getAllProductReceiptOfProductSize(
    productSizeId: string,
    prismaInstance: PrismaService,
  ) {
    const productReceipts = await prismaInstance.productReceipt.findMany({
      where: {
        productSizeId: productSizeId,
        status: {
          in: [ProductReceiptStatus.AVAILABLE],
        },
      },
      include: productReceiptIncludeQuery,
    });

    return productReceipts;
  }
  findById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    return this.prismaService.productReceipt.findUnique({
      where: {
        id,
      },
      include: productReceiptIncludeQuery,
    });
  }

  findByQuery(query: any) {
    return this.prismaService.productReceipt.findFirst({
      where: query,
      include: productReceiptIncludeQuery,
    });
  }
  async createProductReceipts(
    importReceiptId: string,
    inspectionReportDetail: {
      id: string;
      createdAt: Date | null;
      updatedAt: Date | null;
      deletedAt: Date | null;
      inspectionReportId: string;
      materialPackageId: string | null;
      productSizeId: string | null;
      approvedQuantityByPack: number;
      defectQuantityByPack: number;
      quantityByPack: number | null;
    }[],
    productionBatchId: string,
    prismaInstance: PrismaService,
  ) {
    const productReceipts: Prisma.ProductReceiptCreateManyInput[] = [];

    for (const inspectionReportDetailItem of inspectionReportDetail) {
      const productReceipt: Prisma.ProductReceiptCreateManyInput = {
        importReceiptId: importReceiptId,
        productSizeId: inspectionReportDetailItem.productSizeId,
        quantityByUom: inspectionReportDetailItem.quantityByPack,
        remainQuantityByUom: inspectionReportDetailItem.quantityByPack,
        status: ProductReceiptStatus.IMPORTING,
        code: undefined,
      };
      productReceipts.push(productReceipt);

      if (inspectionReportDetailItem.defectQuantityByPack > 0) {
        const defectProductReceipt: Prisma.ProductReceiptCreateManyInput = {
          importReceiptId: importReceiptId,
          productSizeId: inspectionReportDetailItem.productSizeId,
          quantityByUom: inspectionReportDetailItem.defectQuantityByPack,
          remainQuantityByUom: inspectionReportDetailItem.defectQuantityByPack,
          status: ProductReceiptStatus.IMPORTING,
          code: undefined,
        };
        productReceipts.push(defectProductReceipt);
      }
    }

    const result = await prismaInstance.productReceipt.createManyAndReturn({
      data: productReceipts,
    });
    return result;
  }

  async updateProductReceiptStatus(
    id: string,
    status: ProductReceiptStatus,
    prismaInstance: PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      DefaultArgs
    >,
  ) {
    return prismaInstance.productReceipt.update({
      where: {
        id,
      },
      data: {
        importDate: new Date(),
        status,
      },
    });
  }

  async getAllProductReceiptOfProductVariant(productVariantId: string) {
    return await this.prismaService.productReceipt.findMany({
      where: {
        productSize: {
          productVariantId: productVariantId,
        },
        status: {
          in: [ProductReceiptStatus.AVAILABLE],
        },
      },
    });
  }
  create(createProductReceiptDto: CreateProductReceiptDto) {
    return 'This action adds a new productReceipt';
  }

  async findAll(
    findOptions: GeneratedFindOptions<Prisma.ProductReceiptScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productReceipt.findMany({
        skip: offset,
        take: limit,
        where: {
          ...findOptions?.where,
        },
        include: {
          productSize: true,
        },
        orderBy: findOptions?.orderBy,
      }),
      this.prismaService.productReceipt.count({
        where: {
          ...findOptions?.where,
        },
      }),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(
      HttpStatus.OK,
      dataResponse,
      'List of import product receipt',
    );
  }

  async findOne(id: string) {
    const result = await this.findById(id);
    return apiSuccess(200, result, 'Get one product receipt successfully');
  }

  update(id: number, updateProductReceiptDto: UpdateProductReceiptDto) {
    return `This action updates a #${id} productReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} productReceipt`;
  }
}
