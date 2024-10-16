import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { MaterialService } from '../material/material.service';
import { CreateMaterialReceiptDto } from './dto/create-material-receipt.dto';
import { UpdateMaterialReceiptDto } from './dto/update-material-receipt.dto';

@Injectable()
export class MaterialReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialService: MaterialService,
  ) {}

  includeQuery: Prisma.MaterialReceiptInclude = {
    materialVariant: {
      include: {
        material: true,
      },
    },
  };

  findAllMaterialVariant() {
    throw new Error('Method not implemented.');
  }

  async createMaterialReceipts(
    id: string,
    inspectionReportDetail: {
      id: string;
      materialVariantId: string | null;
      productVariantId: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      deletedAt: Date | null;
      approvedQuantityByPack: number;
      defectQuantityByPack: number;
      inspectionReportId: string;
      quantityByPack: number | null;
    }[],
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    const materialReceiptsInput: Prisma.MaterialReceiptCreateManyInput[] =
      inspectionReportDetail.map((detail) => {
        return {
          importReceiptId: id,
          materialVariantId: detail.materialVariantId,
          quantityByPack: detail.approvedQuantityByPack,
        };
      });

    return prismaInstance.materialReceipt.createMany({
      data: materialReceiptsInput,
    });
  }

  create(createMaterialReceiptDto: CreateMaterialReceiptDto) {
    return 'This action adds a new materialReceipt';
  }

  async findAll() {
    const allMaterial = await this.materialService.findAllWithoutResponse();
    const allMaterialReceipt =
      await this.prismaService.materialReceipt.findMany({
        include: this.includeQuery,
      });

    const acc = allMaterial.reduce((acc, material) => {
      acc[material.id] = {
        ...material,
        materialVariant: [],
      };
      return acc;
    }, {});

    allMaterialReceipt.forEach((materialReceipt) => {
      const materialId = materialReceipt.materialVariant.materialId;
      const materialVariantId = materialReceipt.materialVariant.id;

      if (!acc[materialId]) {
        acc[materialId] = {
          ...allMaterial.find((item) => item.id === materialId),
          materialVariant: [],
        };
      }

      const variantIndex = acc[materialId].materialVariant.findIndex(
        (variant) => variant.id === materialVariantId,
      );

      if (variantIndex === -1) {
        acc[materialId].materialVariant.push({
          ...materialReceipt.materialVariant,
          onHand: materialReceipt.quantityByPack,
        });
      } else {
        acc[materialId].variants[variantIndex].onHand +=
          materialReceipt.quantityByPack;
      }
    });

    const result = Object.values(acc);
    return result;
  }

  //Will have to get all export material receipt and inventory report to calculate onHand
  async findAll2() {
    const allMaterial = await this.materialService.findAllWithoutResponse();

    allMaterial.forEach((material: any) => {
      material.numberOfMaterialVariant = material.materialVariant.length;

      if (material.numberOfMaterialVariant > 0) {
        material.onHand = material.materialVariant.reduce(
          (totalAcc, materialVariantEl) => {
            const variantTotal = materialVariantEl.materialReceipt.reduce(
              (acc, el) => {
                if (el.quantityByPack !== undefined) {
                  return acc + el.quantityByPack;
                }
                return acc;
              },
              0,
            );
            return totalAcc + variantTotal;
          },
          0,
        );
      } else {
        material.onHand = 0;
      }
    });

    return apiSuccess(
      HttpStatus.OK,
      allMaterial,
      'Get all material receipt successfully',
    );
  }
  findOne(id: number) {
    return `This action returns a #${id} materialReceipt`;
  }

  update(id: number, updateMaterialReceiptDto: UpdateMaterialReceiptDto) {
    return `This action updates a #${id} materialReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialReceipt`;
  }
}
