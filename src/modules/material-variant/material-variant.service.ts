import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { extractPageAndPageSize, getPageMeta } from 'src/common/utils/utils';
import { CreateMaterialVariantDto } from './dto/create-material-variant.dto';
import { UpdateMaterialVariantDto } from './dto/update-material-variant.dto';

@Injectable()
export class MaterialVariantService {
  constructor(private readonly prismaService: PrismaService) {}

  includeQuery: Prisma.MaterialVariantInclude = {
    material: {
      include: {
        materialType: true,
        materialUom: true,
      },
    },
  };

  async create(createMaterialVariantDto: CreateMaterialVariantDto) {
    const result = await this.prismaService.materialVariant.create({
      data: createMaterialVariantDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Material Variant created successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to create Material Variant',
    );
  }

  async findByIdWithResponse(id: string) {
    const result = await this.findById(id);

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Material Variant retrieved successfully',
      );
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material Variant not found');
  }
  async findAll(
    filterOption?: GeneratedFindOptions<Prisma.MaterialVariantWhereInput>,
  ) {
    const { offset, limit } = await extractPageAndPageSize(filterOption);

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.materialVariant.findMany({
        skip: offset,
        take: limit,
        where: filterOption?.where,
        include: this.includeQuery,
      }),
      this.prismaService.materialVariant.count({
        where: filterOption?.where ? filterOption.where : undefined,
      }),
    ]);

    const data: DataResponse = {
      data: result,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(HttpStatus.OK, data, 'List of Material Variant');
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result = await this.prismaService.materialVariant.findUnique({
      where: { id },
      include: this.includeQuery,
    });
    return result;
  }

  async update(id: string, updateMaterialVariantDto: UpdateMaterialVariantDto) {
    const materialVariant = await this.findById(id);
    if (!materialVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material Variant not found');
    }

    const result = await this.prismaService.materialVariant.update({
      where: { id },
      data: updateMaterialVariantDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Material Variant updated successfully',
      );
    }

    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to update Material Variant',
    );
  }
}
