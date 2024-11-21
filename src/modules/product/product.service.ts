import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { getPageMeta } from 'src/common/utils/utils';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  async create(createProductTypeDto: CreateProductTypeDto) {
    const result = await this.prismaService.product.create({
      data: createProductTypeDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product Type created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Product Type');
  }

  async findAll(findOptions?: GeneratedFindOptions<Prisma.ProductWhereInput>) {
    const { skip, take, ...rest } = findOptions;
    const page = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        where: rest?.where,
        include: {
          productUom: true,
        },
        skip: page,
        take: limit,
      }),
      this.prismaService.product.count({
        where: rest?.where,
      }),
    ]);
    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'Get all product successfully',
    );
  }

  //TODO : Add filterOptions
  // async findAllWithResponse() {
  //   const result = await this.findAll();
  //   if (result) {
  //     return apiSuccess(
  //       HttpStatus.OK,
  //       result,
  //       'Product Type retrieved successfully',
  //     );
  //   }
  //   return apiFailed(HttpStatus.NOT_FOUND, 'Product Type not found');
  // }

  async findByIdWithResponse(id: string) {
    const result = await this.findById(id);
    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Type retrieved successfully',
      );
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Product Type not found');
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result = await this.prismaService.product.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  }

  update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
