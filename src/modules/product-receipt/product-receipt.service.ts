import { Injectable } from '@nestjs/common';
import { ProductReceiptStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductReceiptDto } from './dto/create-product-receipt.dto';
import { UpdateProductReceiptDto } from './dto/update-product-receipt.dto';

@Injectable()
export class ProductReceiptService {
  constructor(private prismaService: PrismaService) {}

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
