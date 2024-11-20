import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
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

  async findAll(
    filterOption?: GeneratedFindOptions<Prisma.ProductSizeWhereInput>,
  ) {
    const { skip, take, ...rest } = filterOption;
    const page = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productSize.findMany({
        skip: page,
        take: limit,
        where: {
          ...rest?.where,
        },
        orderBy: filterOption?.orderBy,
        include: this.includeQuery,
      }),
      this.prismaService.productSize.count({
        where: {
          ...rest?.where,
        },
      }),
    ]);
    return apiSuccess(
      HttpStatus.OK,
      {
        data,
        pageMeta: {
          total: total,
          page: page,
          limit: limit,
        },
      },
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
