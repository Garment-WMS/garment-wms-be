import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { extractPageAndPageSize, getPageMeta } from 'src/common/utils/utils';
import { NestedMaterialPackageDto } from '../material-variant/dto/nested-material-package.dto';
import { CreateMaterialPackageDto } from './dto/create-material-variant.dto';
import { UpdateMaterialVariantDto } from './dto/update-material-variant.dto';

@Injectable()
export class MaterialPackageService {
  async findByQuery(query: any) {
    return this.prismaService.materialPackage.findFirst({
      where: query,
      include: {
        materialVariant: {
          include: {
            materialAttribute: true,
            materialPackage: {
              include: {
                materialReceipt: true,
                inventoryStock: true,
              },
            },
            material: {
              include: {
                materialUom: true,
              },
            },
          },
        },
      },
    });
  }
  constructor(private readonly prismaService: PrismaService) {}

  includeQuery: Prisma.MaterialPackageInclude = {
    inventoryStock: true,
    materialReceipt: true,
    materialVariant: {
      include: {
        material: {
          include: {
            materialUom: true,
          },
        },
      },
    },
  };

  async createManyWithMaterialVariantId(
    materialPackages: NestedMaterialPackageDto[],
    id: string,
  ) {
    const materialPackageInput: Prisma.MaterialPackageCreateManyInput[] =
      materialPackages.map((materialPackage) => {
        return {
          name: materialPackage.name,
          code: undefined,
          packedHeight: materialPackage.packedHeight,
          packedLength: materialPackage.packedLength,
          packedWeight: materialPackage.packedWeight,
          packedWidth: materialPackage.packedWidth,
          packUnit: materialPackage.packUnit,
          uomPerPack: materialPackage.uomPerPack,
          materialVariantId: id,
        };
      });
    return this.prismaService.materialPackage.createManyAndReturn({
      data: materialPackageInput,
    });
  }
  async create(createMaterialVariantDto: CreateMaterialPackageDto) {
    const result = await this.prismaService.materialPackage.create({
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
    filterOption?: GeneratedFindOptions<Prisma.MaterialPackageWhereInput>,
  ) {
    const { offset, limit } = await extractPageAndPageSize(filterOption);

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.materialPackage.findMany({
        skip: offset,
        take: limit,
        where: filterOption?.where,
        orderBy: filterOption?.orderBy,
        include: this.includeQuery,
      }),
      this.prismaService.materialPackage.count({
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
      throw new BadRequestException('Invalid uuid format');
    }
    const result = await this.prismaService.materialPackage.findUnique({
      where: { id },
      include: this.includeQuery,
    });
    return result;
  }

  async findByMaterialCode(materialCode: string) {
    const result = await this.prismaService.materialPackage.findUnique({
      where: { code: materialCode },
      include: this.includeQuery,
    });
    return result;
  }

  async update(id: string, updateMaterialVariantDto: UpdateMaterialVariantDto) {
    const materialPackage = await this.findById(id);
    if (!materialPackage) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material Package not found');
    }

    const result = await this.prismaService.materialPackage.update({
      where: { id },
      data: updateMaterialVariantDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Material Package updated successfully',
      );
    }

    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to update Material Package',
    );
  }

  findAllRaw() {
    const result = this.prismaService.materialPackage.findMany({
      include: this.includeQuery,
    });
    return result;
  }
}
