import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import {
  materialExportRequestInclude,
  productFormulaInclude,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ManagerAction } from '../import-request/dto/import-request/manager-process.dto';
import { CreateNestedMaterialExportRequestDetailDto } from '../material-export-request-detail/dto/create-nested-material-export-request-detail.dto';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { ManagerApproveExportRequestDto } from './dto/manager-approve-export-request.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';

@Injectable()
export class MaterialExportRequestService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(dto: CreateMaterialExportRequestDto) {
    if (!dto.materialExportRequestDetail) {
      this.mapMaterialExportRequestDetailByFormula(
        dto.productFormulaId,
        dto.materialExportRequestDetail,
      );
    }
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

  async mapMaterialExportRequestDetailByFormula(
    productFormulaId: string,
    materialExportRequestDetail: CreateNestedMaterialExportRequestDetailDto[],
  ) {
    const productFormula = await this.prismaService.productFormula.findUnique({
      where: {
        id: productFormulaId,
      },
      include: productFormulaInclude,
    });
    if (!productFormula) {
      throw new NotFoundException('Product formula not found');
    }
    materialExportRequestDetail = productFormula.productFormulaMaterial.map(
      (productFormulaMaterial) => {
        const materialExportRequestDetail: CreateNestedMaterialExportRequestDetailDto =
          {
            materialVariantId: productFormulaMaterial.materialVariantId,
            quantityByUom: productFormulaMaterial.quantityByUom,
          };
        return materialExportRequestDetail;
      },
    );
    return materialExportRequestDetail;
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
        include: materialExportRequestInclude,
      });
    if (!materialExportRequest) {
      throw new NotFoundException('Material Export Request not found');
    }
    return materialExportRequest;
  }

  async findFirst(materialExportRequestId: string) {
    return await this.prismaService.materialExportRequest.findFirst({
      where: {
        id: materialExportRequestId,
      },
      include: materialExportRequestInclude,
    });
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

  async managerApprove(id: string, dto: ManagerApproveExportRequestDto) {
    switch (dto.action) {
      case ManagerAction.APPROVED:
        const materialExportRequest =
          await this.prismaService.materialExportRequest.update({
            where: {
              id: dto.id,
            },
            data: {
              warehouseManagerId: dto.warehouseManagerId,
              status: $Enums.MaterialExportRequestStatus.APPROVED,
              managerNote: dto.managerNote,
              warehouseStaffId: dto.warehouseStaffId,
              updatedAt: new Date(),
            },
          });
        return materialExportRequest;
      case ManagerAction.REJECTED:
        const rejectedMaterialExportRequest =
          await this.prismaService.materialExportRequest.update({
            where: {
              id: dto.id,
            },
            data: {
              warehouseManagerId: dto.warehouseManagerId,
              status: $Enums.MaterialExportRequestStatus.REJECTED,
              managerNote: dto.managerNote,
              rejectAt: new Date(),
              updatedAt: new Date(),
            },
          });
        return rejectedMaterialExportRequest;
      default:
        throw new BadRequestException('Invalid manager action');
    }
  }
}
