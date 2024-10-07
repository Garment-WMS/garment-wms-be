import { HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

@Injectable()
export class ProductTypeService {
  constructor(private prismaService: PrismaService) {}
  async create(createProductTypeDto: CreateProductTypeDto) {
    const result = await this.prismaService.productType.create({
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

  async findAll() {
    const result = await this.prismaService.productType.findMany();
    return result;
  }

  //TODO : Add filterOptions
  async findAllWithResponse() {
    const result = await this.findAll();
    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Type retrieved successfully',
      );
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Product Type not found');
  }

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
    const result = await this.prismaService.productType.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  }

  update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    return `This action updates a #${id} productType`;
  }

  remove(id: number) {
    return `This action removes a #${id} productType`;
  }
}
