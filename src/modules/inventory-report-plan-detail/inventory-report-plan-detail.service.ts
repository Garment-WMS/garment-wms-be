import { HttpStatus, Injectable } from '@nestjs/common';
import { InventoryReportStatus, Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
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
    materialVariant: {
      include: {
        material: {
          include: {
            materialUom: true,
          },
        },
      },
    },
    productVariant: {
      include: {
        product: {
          include: {
            productUom: true,
          },
        },
      },
    },
    inventoryReport: true,
  };

  async checkLastInventoryReportInPlan(inventoryReportId: string) {
    let inventoryReportPlanDetail =
      await this.findByInventoryReportId(inventoryReportId);
    if (inventoryReportPlanDetail.length === 0) {
      return null;
    }
    inventoryReportPlanDetail = await this.findByInventoryReportPlanId(
      inventoryReportPlanDetail[0].inventoryReportPlanId,
    );
    const hasPendingOrExecuting = inventoryReportPlanDetail.some((el) => {
      return el.inventoryReport.status === InventoryReportStatus.IN_PROGRESS;
    });

    if (hasPendingOrExecuting) {
      return null;
    }
    // Further processing...
    return inventoryReportPlanDetail[0].inventoryReportPlanId;
  }
  findByInventoryReportId(inventoryReportId: string) {
    if (!isUUID(inventoryReportId)) {
      throw new Error('Id is required');
    }
    return this.prismaService.inventoryReportPlanDetail.findMany({
      where: {
        inventoryReportId,
      },
      include: this.includeQuery,
    });
  }
  findByInventoryReportPlanId(inventoryReportPlanId: string) {
    if (!isUUID(inventoryReportPlanId)) {
      throw new Error('Id is required');
    }
    return this.prismaService.inventoryReportPlanDetail.findMany({
      where: {
        inventoryReportPlanId,
      },
      include: this.includeQuery,
    });
  }

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

  async findOne(id: string) {
    const inventoryReportPlanDetail = await this.findById(id);
    if (!inventoryReportPlanDetail) {
      throw new Error('Inventory report plan detail not found');
    }
    return apiSuccess(
      HttpStatus.OK,
      inventoryReportPlanDetail,
      'Get inventory report plan detail successfully',
    );
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
