import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { NestedProductAttributeDto } from 'src/modules/production-batch/dto/nested-product-attribute.dto';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Injectable()
export class ProductAttributeService {
  constructor(private readonly prismaService: PrismaService) {}
  async createMany(productAttributes: NestedProductAttributeDto[], id: string) {
    const productAttributesInput: Prisma.ProductAttributeCreateManyInput[] =
      productAttributes.map((productAttribute) => {
        return {
          name: productAttribute.name,
          value: productAttribute.value,
          productVariantId: id,
        };
      });
    return this.prismaService.productAttribute.createManyAndReturn({
      data: productAttributesInput,
    });
  }
  createManyWithProductVariantId(
    productAttributes: NestedProductAttributeDto[],
    id: string,
  ) {
    const productAttributesInput: Prisma.ProductAttributeCreateManyInput[] =
      productAttributes.map((productAttribute) => {
        return {
          name: productAttribute.name,
          value: productAttribute.value,
          productVariantId: id,
        };
      });
    return this.prismaService.productAttribute.createManyAndReturn({
      data: productAttributesInput,
    });
  }

  create(createProductAttributeDto: CreateProductAttributeDto) {
    return 'This action adds a new productAttribute';
  }

  findAll() {
    return `This action returns all productAttribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productAttribute`;
  }

  update(id: number, updateProductAttributeDto: UpdateProductAttributeDto) {
    return `This action updates a #${id} productAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} productAttribute`;
  }
}
