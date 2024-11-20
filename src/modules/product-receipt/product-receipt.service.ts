import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, ProductReceiptStatus } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductReceiptDto } from './dto/create-product-receipt.dto';
import { UpdateProductReceiptDto } from './dto/update-product-receipt.dto';

@Injectable()
export class ProductReceiptService {
  constructor(private prismaService: PrismaService) {}

  productReceiptIncludeQuery: Prisma.ProductReceiptInclude = {
    importReceipt: true,
    receiptAdjustment: true,
    productSize: {
      include: {
        productVariant: {
          include: {
            product: {
              include: {
                productUom: true,
              },
            },
            productAttribute: true,
          },
        },
      },
    },
  };

  findByQuery(query: any) {
    return this.prismaService.productReceipt.findFirst({
      where: query,
      include: this.productReceiptIncludeQuery,
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

  findAll() {
    return `This action returns all productReceipt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productReceipt`;
  }

  update(id: number, updateProductReceiptDto: UpdateProductReceiptDto) {
    return `This action updates a #${id} productReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} productReceipt`;
  }
}
