import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  Injectable,
  Logger,
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
import { TaskService } from '../task/task.service';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { ManagerApproveExportRequestDto } from './dto/manager-approve-export-request.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';

@Injectable()
export class MaterialExportRequestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly taskService: TaskService,
  ) {}
  async create(dto: CreateMaterialExportRequestDto) {
    const productionBatch =
      await this.prismaService.productionBatch.findUniqueOrThrow({
        where: {
          id: dto.productionBatchId,
        },
        select: {
          quantityToProduce: true,
        },
      });

    const quantityToProduce = productionBatch.quantityToProduce;

    if (!dto.materialExportRequestDetail) {
      dto.materialExportRequestDetail =
        await this.mapMaterialExportRequestDetailByFormula(
          dto.productFormulaId,
          quantityToProduce,
        );
      Logger.debug('mapped');
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
    productQuantity: number,
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
    if (!productFormula.productFormulaMaterial) {
      throw new BadRequestException('Product formula material not found');
    }
    const materialExportRequestDetail =
      productFormula.productFormulaMaterial.map((productFormulaMaterial) => {
        const materialExportRequestDetail: CreateNestedMaterialExportRequestDetailDto =
          {
            materialVariantId: productFormulaMaterial.materialVariantId,
            quantityByUom:
              productFormulaMaterial.quantityByUom * productQuantity,
          };
        return materialExportRequestDetail;
      });
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

  async managerApprove(
    id: string,
    dto: ManagerApproveExportRequestDto,
    warehouseManagerId: string,
  ) {
    const allowApproveStatus: $Enums.MaterialExportRequestStatus[] = [
      $Enums.MaterialExportRequestStatus.PENDING,
    ];
    const materialExportRequest = await this.findUnique(id);
    if (!allowApproveStatus.includes(materialExportRequest.status)) {
      throw new BadRequestException(
        `Cannot approve material export request with status ${materialExportRequest.status}`,
      );
    }
    dto.warehouseManagerId = warehouseManagerId;
    dto.materialExportReceipt.materialExportRequestId = id;
    dto.materialExportReceipt.warehouseStaffId = dto.warehouseStaffId;
    dto.materialExportReceipt.type =
      $Enums.MaterialExportReceiptType.PRODUCTION;
    switch (dto.action) {
      case ManagerAction.APPROVED:
        const [materialExportRequest, materialExportReceipt] =
          await this.prismaService.$transaction([
            this.prismaService.materialExportRequest.update({
              where: {
                id: id,
              },
              data: {
                warehouseManagerId: dto.warehouseManagerId,
                status: $Enums.MaterialExportRequestStatus.APPROVED,
                managerNote: dto.managerNote,
                warehouseStaffId: dto.warehouseStaffId,
                updatedAt: new Date(),
              },
              include: materialExportRequestInclude,
            }),
            this.prismaService.materialExportReceipt.create({
              data: {
                note: dto.materialExportReceipt.note,
                type: dto.materialExportReceipt.type,
                materialExportRequestId: id,
                warehouseStaffId: dto.warehouseStaffId,
                materialExportReceiptDetail: {
                  createMany: {
                    data: dto.materialExportReceipt.materialExportReceiptDetail.map(
                      (detail) => ({
                        materialReceiptId: detail.materialReceiptId,
                        quantityByPack: detail.quantityByPack,
                      }),
                    ),
                  },
                },
              },
            }),
          ]);
        try {
          const task = await this.taskService.create({
            materialExportReceiptId: materialExportReceipt.id,
            taskType: $Enums.TaskType.EXPORT,
            status: $Enums.TaskStatus.OPEN,
            warehouseStaffId: dto.warehouseStaffId,
          });
        } catch (error) {
          Logger.error('Cannot create task', error);
        }
        return materialExportRequest;
      case ManagerAction.REJECTED:
        const rejectedMaterialExportRequest =
          await this.prismaService.materialExportRequest.update({
            where: {
              id: id,
            },
            data: {
              warehouseManagerId: dto.warehouseManagerId,
              status: $Enums.MaterialExportRequestStatus.REJECTED,
              managerNote: dto.managerNote,
              rejectAt: new Date(),
              updatedAt: new Date(),
            },
            include: materialExportRequestInclude,
          });
        return rejectedMaterialExportRequest;
      default:
        throw new BadRequestException('Invalid manager action');
    }
  }
}
