import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { InventoryReportService } from '../inventory-report/inventory-report.service';
import { CreateInventoryReportPlanDetailDto } from './dto/create-inventory-report-plan-detail.dto';
import { UpdateInventoryReportPlanDetailDto } from './dto/update-inventory-report-plan-detail.dto';

@Injectable()
export class InventoryReportPlanDetailService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly inventoryReportService: InventoryReportService,
  ) {}

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

  // async processInventoryReportPlanDetail(
  //   id: string,
  //   warehouseManagerId: string,
  // ) {
  //   const inventoryReportPlanDetail = await this.findById(id);
  //   if (!inventoryReportPlanDetail) {
  //     throw new Error('Inventory report plan detail not found');
  //   }
  //   if(inventoryReportPlanDetail.)

  // }
  findById(id: string) {
    if (!isUUID(id)) {
      throw new Error('Id is required');
    }
    return this.prismaService.inventoryReportPlanDetail.findUnique({
      where: {
        id,
      },
      include: this.includeQuery,
    });
  }

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
