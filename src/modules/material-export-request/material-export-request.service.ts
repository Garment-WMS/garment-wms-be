import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { materialExportRequestInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';

@Injectable()
export class MaterialExportRequestService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(dto: CreateMaterialExportRequestDto) {
    const materialExportRequestInput: Prisma.MaterialExportRequestUncheckedCreateInput =
      {
        productionBatchId: dto.productionBatchId,
        productionDepartmentId: dto.productionDepartmentId,
        description: dto.description,
        status: dto.status,
        productFormulaId: dto.productFormulaId,
        materialExportRequestDetail: {
          createMany: {
            data: dto.materialExportRequestDetail.map((detail) => ({
              materialVariantId: detail.materialVariantId,
              quantityByUom: detail.quantityByUom,
            })),
          },
        },
      };

    return await this.prismaService.materialExportRequest.create({
      data: materialExportRequestInput,
      include: materialExportRequestInclude,
    });
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.MaterialExportRequestWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialExportRequest.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: materialExportRequestInclude,
      }),
      this.prismaService.materialExportRequest.count(
        findOptions?.where
          ? {
              where: findOptions.where,
            }
          : undefined,
      ),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async findUnique(id: string) {
    const materialExportRequest =
      await this.prismaService.materialExportRequest.findUnique({
        where: {
          id: id,
        },
      });
    if (!materialExportRequest) {
      throw new NotFoundException('Material Export Request not found');
    }
    return materialExportRequest;
  }

  async update(id: string, dto: UpdateMaterialExportRequestDto) {
    const input: Prisma.MaterialExportRequestUncheckedUpdateInput = {
      productionBatchId: dto.productionBatchId,
      productionDepartmentId: dto.productionDepartmentId,
      description: dto.description,
      status: dto.status,
      productFormulaId: dto.productFormulaId,
      materialExportRequestDetail: {
        upsert: dto.materialExportRequestDetail.map((detail) => ({
          where: {
            id: detail.id,
          },
          update: {
            materialVariantId: detail.materialVariantId,
            quantityByUom: detail.quantityByUom,
          },
          create: {
            materialVariantId: detail.materialVariantId,
            quantityByUom: detail.quantityByUom,
          },
        })),
      },
    };
    return await this.prismaService.materialExportRequest.update({
      where: {
        id: id,
      },
      data: input,
      include: materialExportRequestInclude,
    });
  }

  async remove(id: string) {
    return this.prismaService.materialExportRequest.delete({
      where: {
        id: id,
      },
    });
  }
}
