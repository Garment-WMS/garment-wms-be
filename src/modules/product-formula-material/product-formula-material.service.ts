import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateProductFormulaMaterialDto } from './dto/create-product-formula-material.dto';
import { NestedCreateProductFormulaMaterialDto } from './dto/nested-product-formula-material.dto';
import { UpdateProductFormulaMaterialDto } from './dto/update-product-formula-material.dto';

@Injectable()
export class ProductFormulaMaterialService {
  constructor(private prismaService: PrismaService) {}

  create(createProductFormulaMaterialDto: CreateProductFormulaMaterialDto) {}

  async createMany(
    createProductFormulaMaterialDto: CreateProductFormulaMaterialDto[],
  ) {
    const result = await this.prismaService.$transaction(async (prisma) => {
      return prisma.productFormulaMaterial.createMany({
        data: createProductFormulaMaterialDto,
      });
    });

    return result;
  }

  async createNested(
    nestedCreateProductFormulaMaterialDto: NestedCreateProductFormulaMaterialDto[],
    productFormulaId: string,
    prisma: any,
  ) {
    const result = await prisma.productFormulaMaterial.createMany({
      data: nestedCreateProductFormulaMaterialDto.map((item) => {
        return {
          productFormulaId,
          ...item,
        };
      }),
    });

    return result;
  }

  findAll() {
    return `This action returns all productFormulaMaterial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productFormulaMaterial`;
  }

  async update(
    id: string,
    updateProductFormulaMaterialDto: UpdateProductFormulaMaterialDto,
  ) {
    const result = await this.prismaService.productFormulaMaterial.update({
      where: { id },
      data: updateProductFormulaMaterialDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Formula Material updated successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to update Product Formula Material',
    );
  }

  async remove(id: string) {
    const result = await this.prismaService.productFormulaMaterial.delete({
      where: { id },
    });

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Formula Material deleted successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to delete Product Formula Material',
    );
  }
}
