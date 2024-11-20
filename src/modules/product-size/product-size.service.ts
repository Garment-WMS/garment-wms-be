import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ProductVariantService } from '../product-variant/product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductSizeService {
  constructor(
    private prismaService: PrismaService,
    private productVariantService: ProductVariantService,
  ) {}

  includeQuery: Prisma.ProductSizeInclude = {
    inventoryStock: true,
    productVariant: {
      include: {
        product: {
          include: {
            productUom: true,
          },
        },
      },
    },
  };

  async findQuery(query: any) {
    const result = await this.prismaService.productSize.findFirst({
      where: query,
      include: this.includeQuery,
    });
    return result;
  }

  async create(createProductVariantDto: CreateProductVariantDto) {
    if (!createProductVariantDto.name) {
      const productVariant = await this.productVariantService.findById(
        createProductVariantDto.productVariantId,
      );

      if (!productVariant) {
        return apiFailed(HttpStatus.BAD_REQUEST, 'Product Variant not found');
      }
      createProductVariantDto.name = `${productVariant.name} - ${createProductVariantDto.size.toUpperCase().trim()}`;
    }

    const result = await this.prismaService.productSize.create({
      data: createProductVariantDto,
    });
    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product Variant created successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to create Product Variant',
    );
  }

  async findAll() {
    const result = await this.prismaService.productSize.findMany({
      include: this.includeQuery,
    });
    return apiSuccess(
      HttpStatus.OK,
      result,
      'Get all product variants successfully',
    );
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result = await this.prismaService.productSize.findUnique({
      where: {
        id: id,
      },
      include: this.includeQuery,
    });
    return result;
  }

  async findOne(id: string) {
    const result = await this.findById(id);

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Variant retrieved successfully',
      );
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Product Variant not found');
  }

  async update(id: string, updateProductVariantDto: UpdateProductVariantDto) {
    const result = await this.prismaService.productVariant.update({
      where: {
        id: id,
      },
      data: updateProductVariantDto,
    });
    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Variant updated successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to update Product Variant',
    );
  }

  async remove(id: string) {
    const result = await this.prismaService.productSize.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Variant deleted successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to delete Product Variant',
    );
  }
}
