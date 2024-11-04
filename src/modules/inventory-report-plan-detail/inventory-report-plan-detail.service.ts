import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateInventoryReportPlanDetailDto } from './dto/create-inventory-report-plan-detail.dto';
import { UpdateInventoryReportPlanDetailDto } from './dto/update-inventory-report-plan-detail.dto';

@Injectable()
export class InventoryReportPlanDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  includeQuery: Prisma.InventoryReportPlanDetailInclude = {
    inventoryReportPlan: true,
    materialPackage: {
      include: {
        materialVariant: {
          include: {
            material: {
              include: {
                materialUom: true,
              },
            },
          },
        },
      },
    },
    productSize: {
      include: {
        productVariant: {
          include: {
            product: {
              include: {
                productUom: true,
              },
            },
          },
        },
      },
    },
    inventoryReport: true,
  };

  async getAllInventoryReportPlanByWarehouseStaff(warehouseStaffId: string) {
    const inventoryReportPlanDetail =
      await this.prismaService.inventoryReportPlanDetail.findMany({
        where: {
          warehouseStaffId,
        },
        include: this.includeQuery,
      });
    return inventoryReportPlanDetail;
  }

  async create(
    createInventoryReportPlanDetailDto: CreateInventoryReportPlanDetailDto,
  ) {}

  createMany(
    createInventoryReportPlanDetailDto: Prisma.InventoryReportPlanDetailCreateManyInput[],
    prismaInstace: PrismaService = this.prismaService,
  ) {
    return prismaInstace.inventoryReportPlanDetail.createMany({
      data: createInventoryReportPlanDetailDto,
    });
  }

  findAll() {
    return `This action returns all inventoryReportPlanDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryReportPlanDetail`;
  }

  update(
    id: number,
    updateInventoryReportPlanDetailDto: UpdateInventoryReportPlanDetailDto,
  ) {
    return `This action updates a #${id} inventoryReportPlanDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryReportPlanDetail`;
  }
}
