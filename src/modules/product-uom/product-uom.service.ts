import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateProductUomDto } from './dto/create-product-uom.dto';
import { UpdateProductUomDto } from './dto/update-product-uom.dto';

@Injectable()
export class ProductUomService {
  constructor(private prismaService: PrismaService) {}

  async findById(value: string) {
    if (!value) return null;
    const productUom = await this.prismaService.productUom.findUnique({
      where: {
        id: value,
      },
    });
    return productUom;
  }

  async create(createProductUomDto: CreateProductUomDto) {
    const result = await this.prismaService.productUom.create({
      data: createProductUomDto,
    });
    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Create productUom successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Create productUom failed');
  }

  findAll() {
    return `This action returns all productUom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productUom`;
  }

  update(id: number, updateProductUomDto: UpdateProductUomDto) {
    return `This action updates a #${id} productUom`;
  }

  remove(id: number) {
    return `This action removes a #${id} productUom`;
  }
}
