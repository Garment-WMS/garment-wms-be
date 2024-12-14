import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma, PrismaClient, ProductReceiptStatus } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { isUUID } from 'class-validator';
import {
  productReceiptIncludeQuery,
  productReceiptIncludeQueryWithoutReceipt,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { InventoryStockService } from '../inventory-stock/inventory-stock.service';
import { CreateProductReceiptDto } from './dto/create-product-receipt.dto';
import { ProductReceiptDisposeDto } from './dto/product-receipt-dispose.dto';
import { UpdateProductReceiptDto } from './dto/update-product-receipt.dto';

@Injectable()
export class ProductReceiptService {
  constructor(
    private prismaService: PrismaService,
    private readonly inventoryStockService: InventoryStockService,
  ) {}

  async dispose(productReceiptDisposeDtos: ProductReceiptDisposeDto[]) {
    let result = [];
    for (let productReceiptDisposeDto of productReceiptDisposeDtos) {
      const prevProductReceipt =
        await this.prismaService.productReceipt.findUnique({
          where: {
            id: productReceiptDisposeDto.productReceiptId,
          },
        });
      if (!prevProductReceipt) {
        throw new BadRequestException(
          `Product Receipt id ${productReceiptDisposeDto.productReceiptId} not found`,
        );
      }
      let disposedProductReceiptResult;

      if (
        productReceiptDisposeDto.quantityByUom >
        prevProductReceipt.remainQuantityByUom
      ) {
        throw new BadRequestException(
          `Quantity dispose not greater than remain quantity`,
        );
      } else if (
        productReceiptDisposeDto.quantityByUom <
        prevProductReceipt.remainQuantityByUom
      ) {
        Logger.debug(
          'productReceiptDisposeDto.quantityByUom',
          productReceiptDisposeDto.quantityByUom,
        );
        Logger.debug(
          'prevProductReceipt.remainQuantityByUom',
          prevProductReceipt.remainQuantityByUom,
        );
        const [disposedProductReceipt, productReceipt] =
          await this.prismaService.$transaction([
            this.prismaService.productReceipt.create({
              data: {
                expireDate: prevProductReceipt.expireDate,
                importDate: prevProductReceipt.importDate,
                importReceiptId: prevProductReceipt.importReceiptId,
                productSizeId: prevProductReceipt.productSizeId,
                quantityByUom: productReceiptDisposeDto.quantityByUom,
                remainQuantityByUom: productReceiptDisposeDto.quantityByUom,
                status: ProductReceiptStatus.DISPOSED,
              },
            }),
            this.prismaService.productReceipt.update({
              where: {
                id: productReceiptDisposeDto.productReceiptId,
              },
              data: {
                remainQuantityByUom:
                  prevProductReceipt.remainQuantityByUom -
                  productReceiptDisposeDto.quantityByUom,
              },
            }),
          ]);
        Logger.debug(disposedProductReceipt, productReceipt);
        disposedProductReceiptResult = disposedProductReceipt;
      } else {
        const disposedProductReceipt =
          await this.prismaService.productReceipt.update({
            where: {
              id: productReceiptDisposeDto.productReceiptId,
              remainQuantityByUom:
                prevProductReceipt.remainQuantityByUom -
                productReceiptDisposeDto.quantityByUom,
            },
            data: {
              status: ProductReceiptStatus.DISPOSED,
            },
          });
        disposedProductReceiptResult = disposedProductReceipt;
      }
      result.push(disposedProductReceiptResult);
      //update minus inventory stock
      const inventoryStock =
        await this.inventoryStockService.updateProductStock(
          prevProductReceipt.productSizeId,
          -productReceiptDisposeDto.quantityByUom,
        );
    }
    return apiSuccess(
      HttpStatus.OK,
      result,
      'Product Receipt disposed successfully',
    );
  }

  async findByCode(code: string) {
    const result = await this.prismaService.productReceipt.findFirst({
      where: {
        code,
      },
      include: productReceiptIncludeQueryWithoutReceipt,
    });
    return apiSuccess(
      result ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      result,
      result ? 'Product Receipt found' : 'Product Receipt not found',
    );
  }
  updateAwaitStatus() {
    throw new Error('Method not implemented.');
  }

  async updateProductReceiptQuantity(
    id: string,
    quantityByUom: number,
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    const productReceipt = await this.findById(id);
    if (!productReceipt) {
      throw new BadRequestException('Material Receipt not found');
    }
    await prismaInstance.productReceipt.update({
      where: {
        id,
      },
      data: {
        remainQuantityByUom: quantityByUom,
        ...(quantityByUom === 0 && { status: ProductReceiptStatus.USED }),
      },
    });

    const remainQuantityByUom = await this.getRemainQuantityByProductSize(
      productReceipt.productSizeId,
      this.prismaService,
    );

    await this.inventoryStockService.updateProductStockQuantity(
      productReceipt.productSizeId,
      remainQuantityByUom,
      this.prismaService,
    );
    return null;
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
      if (inspectionReportDetailItem.defectQuantityByPack > 0) {
        const defectProductReceipt: Prisma.ProductReceiptCreateManyInput = {
          importReceiptId: importReceiptId,
          productSizeId: inspectionReportDetailItem.productSizeId,
          quantityByUom: inspectionReportDetailItem.defectQuantityByPack,
          remainQuantityByUom: inspectionReportDetailItem.defectQuantityByPack,
          isDefect: true,
          status: ProductReceiptStatus.IMPORTING,
          code: undefined,
        };
        productReceipts.push(defectProductReceipt);
      }
      if (inspectionReportDetailItem.approvedQuantityByPack > 0) {
        const productReceipt: Prisma.ProductReceiptCreateManyInput = {
          importReceiptId: importReceiptId,
          productSizeId: inspectionReportDetailItem.productSizeId,
          quantityByUom: inspectionReportDetailItem.approvedQuantityByPack,
          remainQuantityByUom:
            inspectionReportDetailItem.approvedQuantityByPack,
          status: ProductReceiptStatus.IMPORTING,
          code: undefined,
        };
        productReceipts.push(productReceipt);
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
