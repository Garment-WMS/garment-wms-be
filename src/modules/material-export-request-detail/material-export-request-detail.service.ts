import { Injectable, NotFoundException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMaterialExportRequestDetailDto } from './dto/create-material-export-request-detail.dto';
import { UpdateMaterialExportRequestDetailDto } from './dto/update-material-export-request-detail.dto';

@Injectable()
export class MaterialExportRequestDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkQuantityEnoughForExportRequestDetail(
    materialExportRequestDetailId: string,
  ) {
    const materialExportRequestDetail =
      await this.prismaService.materialExportRequestDetail.findUnique({
        where: { id: materialExportRequestDetailId },
      });
    if (!materialExportRequestDetail) {
      throw new NotFoundException(
        `Material export request detail with id ${materialExportRequestDetailId} not found`,
      );
    }
    const materialReceipts = await this.prismaService.materialReceipt.findMany({
      where: {
        materialPackage: {
          materialVariantId: materialExportRequestDetail.materialVariantId,
        },
        status: {
          in: [$Enums.MaterialReceiptStatus.AVAILABLE],
        },
        remainQuantityByPack: {
          gt: 0,
        },
      },
      include: {
        materialPackage: true,
      },
    });
    const availableQuantity = materialReceipts.reduce(
      (sum, receipt) => sum + receipt.remainQuantityByPack,
      0,
    );
    return {
      materialVariantId: materialExportRequestDetail.materialVariantId,
      // materialReceipts,
      requiredQuantity: materialExportRequestDetail.quantityByUom,
      availableQuantity,
      fullFilledPercentage:
        (availableQuantity / materialExportRequestDetail.quantityByUom) * 100,
      isFullFilled:
        availableQuantity >= materialExportRequestDetail.quantityByUom,
    };
  }

  create(
    createMaterialExportRequestDetailDto: CreateMaterialExportRequestDetailDto,
  ) {
    return 'This action adds a new materialExportRequestDetail';
  }

  findAll() {
    return `This action returns all materialExportRequestDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialExportRequestDetail`;
  }

  update(
    id: number,
    updateMaterialExportRequestDetailDto: UpdateMaterialExportRequestDetailDto,
  ) {
    return `This action updates a #${id} materialExportRequestDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialExportRequestDetail`;
  }
}
