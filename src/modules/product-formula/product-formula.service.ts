import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { NestedCreateProductFormulaMaterialDto } from '../product-formula-material/dto/nested-product-formula-material.dto';
import { ProductFormulaMaterialService } from '../product-formula-material/product-formula-material.service';
import { CreateProductFormulaDto } from './dto/create-product-formula.dto';
import { UpdateProductFormulaDto } from './dto/update-product-formula.dto';

@Injectable()
export class ProductFormulaService {
  constructor(
    private prismaService: PrismaService,
    private productFormulaMaterialService: ProductFormulaMaterialService,
  ) {}

  queryInclude: Prisma.ProductFormulaInclude = {
    productFormulaMaterial: {
      include: {
        material: {
          include: {
            materialType: true,
            materialUom: true,
          },
        },
      },
    },
  };

  async findById(value: string) {
    if (!isUUID(value)) return null;
    const productFormula = await this.prismaService.productFormula.findUnique({
      where: { id: value },
    });
    return productFormula;
  }

  async createProductFormulaMaterial(
    id: string,
    createNestedProductFormulaMaterial: NestedCreateProductFormulaMaterialDto[],
  ) {
    await this.prismaService.$transaction(async (prisma) => {
      await this.productFormulaMaterialService.createNested(
        createNestedProductFormulaMaterial,
        id,
        prisma,
      );
    });
    return apiSuccess(
      HttpStatus.CREATED,
      createNestedProductFormulaMaterial,
      'Product Formula Material created successfully',
    );
  }

  async create(createProductFormulaDto: CreateProductFormulaDto) {
    const { productFormulaMaterials, ...rest } = createProductFormulaDto;

    if (rest.quantityRangeStart > rest.quantityRangeEnd) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Quantity range start must be less than quantity range end',
      );
    }

    const result = await this.prismaService.$transaction(async (prisma) => {
      const result = await prisma.productFormula.create({
        data: rest,
      });
      if (result) {
        await this.productFormulaMaterialService.createNested(
          productFormulaMaterials,
          result.id,
          prisma,
        );
        return result;
      }
    });
    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product Formula created successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to create Product Formula',
    );
  }

  async findAll() {
    const result = await this.prismaService.productFormula.findMany({
      include: this.queryInclude,
    });
    return apiSuccess(HttpStatus.OK, result, 'List of Product Formula');
  }

  async findOne(id: string) {
    const result = await this.prismaService.productFormula.findUnique({
      where: { id },
      include: this.queryInclude,
    });
    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Formula retrieved successfully',
      );
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Product Formula not found');
  }

  async update(id: string, updateProductFormulaDto: UpdateProductFormulaDto) {
    const productFormula = await this.findById(id);
    if (!productFormula) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Product Formula not found');
    }

    const startRange =
      updateProductFormulaDto?.quantityRangeEnd ||
      productFormula.quantityRangeStart;
    const endRange =
      updateProductFormulaDto?.quantityRangeEnd ||
      productFormula.quantityRangeEnd;

    if (startRange > endRange) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Quantity range start must be less than quantity range end',
      );
    }

    const result = await this.prismaService.productFormula.update({
      where: { id },
      data: updateProductFormulaDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Formula updated successfully',
      );
    }

    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to update Product Formula',
    );
  }

  async remove(id: string) {
    const productFormula = await this.findById(id);
    if (!productFormula) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Product Formula not found');
    }

    const result = await this.prismaService.productFormula.delete({
      where: { id },
    });

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product Formula deleted successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to delete Product Formula',
    );
  }
}