import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InventoryReportPlanStatus, Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { InventoryReportPlanDetailService } from '../inventory-report-plan-detail/inventory-report-plan-detail.service';
import { InventoryReportService } from '../inventory-report/inventory-report.service';
import { CreateInventoryReportPlanDto } from './dto/create-inventory-report-plan.dto';
import { InventoryReportPlanDto } from './dto/inventory-report-plan.dto';
import { UpdateInventoryReportPlanDto } from './dto/update-inventory-report-plan.dto';

@Injectable()
export class InventoryReportPlanService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly inventoryReportPlanDetailService: InventoryReportPlanDetailService,
    private readonly inventoryReportService: InventoryReportService,
  ) {}

  queryInclude: Prisma.InventoryReportPlanInclude = {
    inventoryReportPlanDetail: {
      where: {
        deletedAt: null,
      },
      include: {
        materialPackage: {
          where: {
            deletedAt: null,
          },
          include: {
            inventoryStock: true,
          },
        },
        productSize: {
          where: {
            deletedAt: null,
          },
          include: {
            inventoryStock: true,
          },
        },
        inventoryReport: {
          where: {
            deletedAt: null,
          },
          include: {
            inventoryReportDetail: true,
          },
        },
      },
    },
  };

  async checkLastInventoryReportInPlan(inventoryReportId: string) {
    throw new Error('Method not implemented.');
  }
  async updateStatus(
    inventoryReportPlanId: string,
    status: InventoryReportPlanStatus,
  ) {
    return await this.prismaService.inventoryReportPlan.update({
      where: { id: inventoryReportPlanId },
      data: {
        status,
      },
    });
  }

  async processInventoryReportPlan(id: string, warehouseStaffId: string) {
    const inventoryReportPlan = await this.findById(id);

    if (!inventoryReportPlan) {
      return apiFailed(404, 'Inventory report plan not found');
    }

    const inventoryReportPlanDetailBelongToWarehouseStaff =
      inventoryReportPlan.inventoryReportPlanDetail.filter((el) => {
        if (el.warehouseStaffId === warehouseStaffId) {
          return el;
        }
      });

    if (
      !inventoryReportPlanDetailBelongToWarehouseStaff ||
      !inventoryReportPlanDetailBelongToWarehouseStaff.length
    ) {
      return apiFailed(
        403,
        'You are not allowed to process this inventory report plan',
      );
    }

    if (
      !inventoryReportPlanDetailBelongToWarehouseStaff.some(
        (el) => el.inventoryReportId === null,
      )
    ) {
      return apiFailed(
        400,
        'All inventory report plan detail already processed',
      );
    }
    console.log(inventoryReportPlanDetailBelongToWarehouseStaff);
    const inventoryReportInput: InventoryReportPlanDto = {
      ...inventoryReportPlan,
      inventoryReportPlanDetail:
        inventoryReportPlanDetailBelongToWarehouseStaff,
    };
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const inventoryReport =
          await this.inventoryReportService.createInventoryReport(
            inventoryReportInput,
            warehouseStaffId,
            prismaInstance,
          );
        if (!inventoryReport) {
          return null;
        }
        console.log(inventoryReport);
        await prismaInstance.inventoryReportPlanDetail.updateMany({
          where: {
            id: {
              in: inventoryReportPlanDetailBelongToWarehouseStaff.map(
                (el) => el.id,
              ),
            },
          },
          data: {
            inventoryReportId: inventoryReport.id,
          },
        });

        if (inventoryReport.status === InventoryReportPlanStatus.PENDING) {
          await prismaInstance.inventoryReportPlan.update({
            where: { id },
            data: {
              status: InventoryReportPlanStatus.IN_PROGRESS,
            },
          });
        }
        return inventoryReport;
      },
    );

    if (result) {
      return apiSuccess(
        200,
        result,
        'Inventory report plan processed successfully',
      );
    }
  }
  findById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Id is not valid');
    }
    return this.prismaService.inventoryReportPlan.findUnique({
      where: { id },
      include: this.queryInclude,
    });
  }

  async getAllInventoryReportPlanByWarehouseStaff(warehouseStaffId: string) {
    const reportPlan = await this.prismaService.inventoryReportPlan.findMany({
      where: {
        inventoryReportPlanDetail: {
          some: {
            warehouseStaffId,
          },
        },
      },
      include: this.queryInclude,
    });
    return apiSuccess(
      HttpStatus.OK,
      reportPlan,
      'Get all inventory report plan by warehouse staff successfully',
    );
  }

  async create(
    createInventoryReportPlanDto: CreateInventoryReportPlanDto,
    warehouseManagerId: string,
  ) {
    const inventoryPlanInput: Prisma.InventoryReportPlanCreateInput = {
      code: undefined,
      title: createInventoryReportPlanDto.title,
      from: createInventoryReportPlanDto.from,
      to: createInventoryReportPlanDto.to,
      warehouseManager: {
        connect: { id: warehouseManagerId },
      },
    };

    const isInventoryPlanValid = await this.validateInventoryReportPlan(
      createInventoryReportPlanDto,
    );

    if (isInventoryPlanValid) {
      return apiFailed(
        400,
        'Inventory report plan in time range already exists',
      );
    }

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const inventoryPlanResult =
          await prismaInstance.inventoryReportPlan.create({
            data: inventoryPlanInput,
            include: { inventoryReportPlanDetail: true },
          });

        const inventoryPlanDetailInput: Prisma.InventoryReportPlanDetailCreateManyInput[] =
          createInventoryReportPlanDto.inventoryReportPlanDetails.map((el) => {
            return {
              code: undefined,
              inventoryReportPlanId: inventoryPlanResult.id,
              materialPackageId: el.materialPackageId,
              productIdSizeId: el.productSizeId,
              warehouseStaffId: el.warehouseStaffId,
            };
          });

        await this.inventoryReportPlanDetailService.createMany(
          inventoryPlanDetailInput,
          prismaInstance,
        );

        const inventoryPlanDetailResult =
          await prismaInstance.inventoryReportPlanDetail.findMany({
            where: { inventoryReportPlanId: inventoryPlanResult.id },
          });

        inventoryPlanResult.inventoryReportPlanDetail =
          inventoryPlanDetailResult;

        return inventoryPlanResult;
      },
    );

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Inventory report plan created successfully',
      );
    }
    return apiFailed(500, 'Create inventory report plan failed');
  }

  async validateInventoryReportPlan(
    createInventoryReportPlanDto: CreateInventoryReportPlanDto,
  ) {
    const inventoryPlanInTimeRange = await this.getAllReportPlanInTimeRange(
      createInventoryReportPlanDto.from,
      createInventoryReportPlanDto.to,
    );
    return !!inventoryPlanInTimeRange.length;
  }

  async getAllReportPlanInTimeRange(from: Date, to?: Date) {
    return await this.prismaService.inventoryReportPlan.findMany({
      where: {
        from: {
          gte: from,
        },
        ...(to && { to: { lte: to } }),
      },
    });
  }

  async findAll(
    findOptions: GeneratedFindOptions<Prisma.InventoryReportPlanWhereInput>,
  ) {
    const result = await this.prismaService.inventoryReportPlan.findMany({
      where: findOptions.where,
      include: this.queryInclude,
    });
    return apiSuccess(
      200,
      result,
      'Get all inventory report plan successfully',
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryReportPlan`;
  }

  update(
    id: number,
    updateInventoryReportPlanDto: UpdateInventoryReportPlanDto,
  ) {
    return `This action updates a #${id} inventoryReportPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryReportPlan`;
  }
}
