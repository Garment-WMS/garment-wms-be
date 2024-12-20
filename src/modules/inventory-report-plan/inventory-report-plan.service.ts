import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  InventoryReportPlanStatus,
  InventoryReportPlanType,
  Prisma,
  TaskType,
} from '@prisma/client';
import { isUUID } from 'class-validator';
import { inventoryReportPlan } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ChangeFieldDto } from 'src/notification/dto/change-field.dto';
import { ImportRequestService } from '../import-request/import-request.service';
import { InventoryReportPlanDetailService } from '../inventory-report-plan-detail/inventory-report-plan-detail.service';
import { InventoryReportService } from '../inventory-report/inventory-report.service';
import { MaterialExportReceiptService } from '../material-export-receipt/material-export-receipt.service';
import { MaterialExportRequestService } from '../material-export-request/material-export-request.service';
import { MaterialVariantService } from '../material-variant/material-variant.service';
import { ProductVariantService } from '../product-variant/product-variant.service';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { TaskService } from '../task/task.service';
import { CreateInventoryReportPlanDto } from './dto/create-inventory-report-plan.dto';
import { InventoryReportPlanDto } from './dto/inventory-report-plan.dto';
import { CreateOverAllInventoryReportPlanDto } from './dto/over-all-report-plan.dto';
import { UpdateInventoryReportPlanDto } from './dto/update-inventory-report-plan.dto';

interface InventoryReportPlanPayload
  extends Prisma.InventoryReportPlanGetPayload<{
    include: typeof inventoryReportPlan;
  }> {}

@Injectable()
export class InventoryReportPlanService {
  async cancelInventoryReportPlan(id: string, warehouseManagerId: string) {
    const inventoryReportPlan = await this.findById(id);
    if (!inventoryReportPlan) {
      throw new BadRequestException('Inventory report plan not found');
    }
    if (inventoryReportPlan.warehouseManagerId !== warehouseManagerId) {
      return apiFailed(
        HttpStatus.FORBIDDEN,
        'You are not allowed to cancel this inventory report plan',
      );
    }

    if (inventoryReportPlan.status === InventoryReportPlanStatus.FINISHED) {
      throw new BadRequestException(
        'Inventory report plan is already finished',
      );
    }
    if (inventoryReportPlan.status === InventoryReportPlanStatus.CANCELLED) {
      throw new BadRequestException(
        'Inventory report plan is already cancelled',
      );
    }
    if (inventoryReportPlan.status === InventoryReportPlanStatus.IN_PROGRESS) {
      throw new BadRequestException('Inventory report plan is in progress');
    }
    const result = this.updateStatus(id, InventoryReportPlanStatus.CANCELLED);
    if (result) {
      await this.taskService.updateTaskStatusToCancelled({
        inventoryReportPlanId: id,
      });
    }
    return apiSuccess(
      HttpStatus.NO_CONTENT,
      {},
      'Inventory report plan cancelled successfully',
    );
  }
  constructor(
    private readonly prismaService: PrismaService,
    private readonly inventoryReportPlanDetailService: InventoryReportPlanDetailService,
    private readonly productVariantService: ProductVariantService,
    private readonly materialVariantService: MaterialVariantService,
    private readonly inventoryReportService: InventoryReportService,
    private readonly importRequestService: ImportRequestService,
    private readonly materialExportRequestService: MaterialExportRequestService,
    private readonly taskService: TaskService,
    private readonly eventEmitter: EventEmitter2,
    // private readonly importReceiptService: ImportReceiptService,
    private readonly materialExportReceiptService: MaterialExportReceiptService,
  ) {}

  @OnEvent('start-await-inventory-report-plan')
  async handleStartAwaitInventoryReportPlan() {
    // console.log('Start await inventory report plan');
    await this.startAwaitInventoryReportPlan();
  }

  async findAllInProgress() {
    const inventoryReportPlans =
      await this.prismaService.inventoryReportPlan.findMany({
        where: {
          status: InventoryReportPlanStatus.IN_PROGRESS,
        },
      });
    return apiSuccess(
      HttpStatus.OK,
      inventoryReportPlans,
      'Get all inventory report plan in progress successfully',
    );
  }

  async findAllInProgressWithoutResponse() {
    const inventoryReportPlans =
      await this.prismaService.inventoryReportPlan.findMany({
        where: {
          status: InventoryReportPlanStatus.IN_PROGRESS,
        },
      });
    return inventoryReportPlans;
  }

  async awaitRecordInventoryReportPlan(id: string, warehouseManagerId: string) {
    const inventoryReportPlan = await this.findById(id);
    if (!inventoryReportPlan) {
      throw new BadRequestException('Inventory report plan not found');
    }

    if (inventoryReportPlan.status !== InventoryReportPlanStatus.NOT_YET) {
      throw new BadRequestException(
        'Inventory report plan is already in progress',
      );
    }

    const isAnyInventoryInProgressOrAwait =
      await this.getAllInventoryReportPlanInProgressOrAwait();

    if (isAnyInventoryInProgressOrAwait.length > 0) {
      throw new BadRequestException(
        'There is already an inventory report plan in progress or await',
      );
    }

    await this.updateStatus(id, InventoryReportPlanStatus.AWAIT);
    return apiSuccess(
      HttpStatus.NO_CONTENT,
      {},
      'Inventory report plan started successfully',
    );
  }
  getAllInventoryReportPlanInProgressOrAwait() {
    return this.prismaService.inventoryReportPlan.findMany({
      where: {
        OR: [
          { status: InventoryReportPlanStatus.IN_PROGRESS },
          { status: InventoryReportPlanStatus.AWAIT },
        ],
      },
    });
  }

  async startRecordInventoryReportPlan(id: string, warehouseManager: string) {
    const inventoryReportPlanInProgress =
      await this.findAllInProgressWithoutResponse();
    if (inventoryReportPlanInProgress.length > 0) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'There is already an inventory report plan in progress',
        inventoryReportPlanInProgress,
      );
    }

    const inventoryReportPlan = await this.findById(id);

    const isAnyImportingImportRequest =
      await this.importRequestService.isAnyImportingImportRequest(
        inventoryReportPlan,
      );
    const isAnyExportingExportRequest =
      await this.materialExportRequestService.isAnyExportingExportRequest(
        inventoryReportPlan,
      );
    // const isAnyImportingImportReceipt = await this.importReceiptService.isAnyImportingImportReceipt();
    if (
      isAnyImportingImportRequest.length > 0 ||
      isAnyExportingExportRequest.length > 0
    ) {
      // await this.updateStatus(id, InventoryReportPlanStatus.AWAIT);
      return apiFailed(
        HttpStatus.CONFLICT,
        'Cannot start recording inventory report plan while there is importing import request',
        { isAnyImportingImportRequest, isAnyExportingExportRequest },
      );
    }

    if (!inventoryReportPlan) {
      throw new BadRequestException('Inventory report plan not found');
    }
    if (inventoryReportPlan.status === InventoryReportPlanStatus.FINISHED) {
      throw new BadRequestException(
        'Inventory report plan is already in progress',
      );
    }
    if (inventoryReportPlan.status === InventoryReportPlanStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Inventory report plan is already in progress',
      );
    }
    if (inventoryReportPlan.status === InventoryReportPlanStatus.CANCELLED) {
      throw new BadRequestException(
        'Inventory report plan is already cancelled',
      );
    }

    const warehouseStaffs =
      await this.prismaService.inventoryReportPlan.findMany({
        where: {
          id: id,
        },
        select: {
          inventoryReportPlanDetail: {
            select: {
              warehouseStaffId: true,
            },
          },
        },
      });

    const staffIds = warehouseStaffs.flatMap((plan) =>
      plan.inventoryReportPlanDetail.map((detail) => detail.warehouseStaffId),
    );
    const uniqueStaffIds = Array.from(new Set(staffIds));
    await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        await Promise.all(
          uniqueStaffIds.map((staffId) =>
            this.improveProcessInventoryReportPlan(
              inventoryReportPlan,
              staffId,
              prismaInstance,
            ),
          ),
        );

        if (
          inventoryReportPlan.status === InventoryReportPlanStatus.NOT_YET ||
          inventoryReportPlan.status === InventoryReportPlanStatus.AWAIT
        ) {
          await prismaInstance.inventoryReportPlan.update({
            where: { id: inventoryReportPlan.id },
            data: {
              status: InventoryReportPlanStatus.IN_PROGRESS,
              startedAt: new Date(),
            },
          });
        } else {
          throw new BadRequestException(
            'Inventory report plan is already in progress',
          );
        }

        return apiSuccess(
          HttpStatus.NO_CONTENT,
          {},
          'Inventory report plan started successfully',
        );
      },
      {
        timeout: 100000,
      },
    );

    await this.taskService.updateManyTaskStatusToInProgress({
      inventoryReportPlanId: id,
    });
    const changeFieldDto: ChangeFieldDto = {
      status: {
        before: InventoryReportPlanStatus.NOT_YET,
        after: InventoryReportPlanStatus.IN_PROGRESS,
      },
    };
    await this.eventEmitter.emit('notification.inventoryReportPlan.updated', {
      changeField: changeFieldDto,
      inventoryReportPlanId: id,
    });

    return apiSuccess(
      HttpStatus.NO_CONTENT,
      {},
      'Inventory report plan started successfully',
    );
  }

  async startAwaitInventoryReportPlan() {
    const awaitInventoryReportPlan = await this.findQuery({
      where: {
        status: InventoryReportPlanStatus.AWAIT,
      },
    });
    for (let i = 0; i < awaitInventoryReportPlan.length; i++) {
      await this.startRecordInventoryReportPlan(
        awaitInventoryReportPlan[i].id,
        awaitInventoryReportPlan[i].warehouseManager.id,
      );
    }
    return true;
  }

  findQuery(query: Prisma.InventoryReportPlanFindManyArgs) {
    return this.prismaService.inventoryReportPlan.findMany({
      ...query,
      include: {
        inventoryReportPlanDetail: true,
        warehouseManager: true,
      },
    });
  }

  async createOverAllInventoryPlan(
    createInventoryReportPlanDto: CreateOverAllInventoryReportPlanDto,
    warehouseManagerId: string,
  ) {
    const isInventoryPlanValid = await this.validateInventoryReportPlan(
      createInventoryReportPlanDto,
    );

    if (isInventoryPlanValid.length > 0) {
      return apiFailed(
        409,
        'Inventory report plan in time range already exists',
        isInventoryPlanValid,
      );
    }

    const allVariants = [
      ...(await this.materialVariantService.findAllMaterialHasReceipt()),
      ...(await this.productVariantService.findProductHasReceipt()),
    ];

    const inventoryPlanInputs: Prisma.InventoryReportPlanCreateInput = {
      title: createInventoryReportPlanDto.title,
      warehouseManager: {
        connect: { id: warehouseManagerId },
      },
      from: createInventoryReportPlanDto.from,
      to: createInventoryReportPlanDto.to,
      type: InventoryReportPlanType.OVERALL,
      note: createInventoryReportPlanDto.note,
      status: InventoryReportPlanStatus.NOT_YET,
    };
    const staffList = createInventoryReportPlanDto.staffList;
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const inventoryPlanResult =
          await prismaInstance.inventoryReportPlan.create({
            data: inventoryPlanInputs,
            include: {
              inventoryReportPlanDetail: true,
            },
          });

        const inventoryReportPlanDetails: Prisma.InventoryReportPlanDetailCreateManyInput[] =
          [];

        // Round-robin assignment of variants to staff
        allVariants.forEach((variant: any, index) => {
          const staffIndex = index % staffList.length;
          const staffId = staffList[staffIndex] as any;
          inventoryReportPlanDetails.push({
            materialVariantId: variant.materialId ? variant.id : undefined,
            productVariantId: variant.productId ? variant.id : undefined,
            code: undefined,
            inventoryReportPlanId: inventoryPlanResult.id,
            warehouseStaffId: staffId.warehouseStaffId as string,
          });
        });
        await this.inventoryReportPlanDetailService.createMany(
          inventoryReportPlanDetails,
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
      {
        maxWait: 100000,
      },
    );
    const staffListUnique = Array.from(
      new Set(
        staffList.reduce(
          (acc, plan) => acc.concat(plan.warehouseStaffId),
          [] as string[],
        ),
      ),
    );

    const createTaskDto: CreateTaskDto[] = [];
    staffListUnique.forEach((warehouseStaffId: string) => {
      createTaskDto.push({
        status: 'OPEN',
        taskType: TaskType.INVENTORY,
        warehouseStaffId: warehouseStaffId,
        inventoryReportPlanId: result.id,
        expectedStartedAt: createInventoryReportPlanDto.from,
        expectedFinishedAt: createInventoryReportPlanDto.to,
      });
    });
    await this.taskService.createMany(createTaskDto);

    return apiSuccess(
      HttpStatus.CREATED,
      result,
      'Inventory report plan created successfully',
    );
  }

  async checkLastInventoryReportInPlan(inventoryReportId: string) {
    throw new Error('Method not implemented.');
  }
  async updateStatus(
    inventoryReportPlanId: string,
    status: InventoryReportPlanStatus,
  ) {
    const result = await this.prismaService.inventoryReportPlan.update({
      where: { id: inventoryReportPlanId },
      data: {
        status,
      },
    });

    // if (result?.status == InventoryReportPlanStatus.FINISHED) {
    //   await this.importRequestService.updateAwaitStatusToImportingStatus();
    //   await this.importReceiptService.updateAwaitStatusToImportingStatus();
    //   await this.materialExportReceiptService.updateAwaitStatusToExportingStatus();
    //   await this.materialExportRequestService.updateAwaitStatusToExportingStatus();
    // }
    return result;
  }

  async processInventoryReportPlan(
    id: string,
    warehouseStaffId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const inventoryReportPlan = await this.findById(id);

    if (!inventoryReportPlan) {
      throw new BadRequestException('Inventory report plan not found');
    }

    if (inventoryReportPlan.status === 'IN_PROGRESS') {
      throw new BadRequestException(
        'Inventory report plan is already in progress',
      );
    }

    const inventoryReportPlanDetailBelongToWarehouseStaff =
      inventoryReportPlan.inventoryReportPlanDetail.filter((el) => {
        if (el.warehouseStaffId === warehouseStaffId) {
          return el;
        }
      });

    const inventoryReportInput: InventoryReportPlanDto = {
      ...inventoryReportPlan,
      inventoryReportPlanDetail:
        inventoryReportPlanDetailBelongToWarehouseStaff,
    };

    const inventoryReport =
      await this.inventoryReportService.createInventoryReport(
        inventoryReportInput,
        warehouseStaffId,
        prismaInstance,
      );
    if (!inventoryReport) {
      throw new BadRequestException('Create inventory report failed');
    }
    const result = await prismaInstance.inventoryReportPlanDetail.updateMany({
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

    if (
      inventoryReportPlan.status === InventoryReportPlanStatus.NOT_YET ||
      inventoryReportPlan.status === InventoryReportPlanStatus.AWAIT
    ) {
      await prismaInstance.inventoryReportPlan.update({
        where: { id },
        data: {
          status: InventoryReportPlanStatus.IN_PROGRESS,
        },
      });
    } else {
      throw new BadRequestException(
        'Inventory report plan is already in progress',
      );
    }

    return apiSuccess(200, {}, 'Inventory report plan processed successfully');
  }

  async improveProcessInventoryReportPlan(
    inventoryReportPlan: InventoryReportPlanPayload,
    warehouseStaffId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const inventoryReportPlanDetailBelongToWarehouseStaff =
      inventoryReportPlan.inventoryReportPlanDetail.filter((el) => {
        if (el.warehouseStaffId === warehouseStaffId) {
          return el;
        }
      });

    const inventoryReportInput: InventoryReportPlanDto = {
      ...inventoryReportPlan,
      inventoryReportPlanDetail:
        inventoryReportPlanDetailBelongToWarehouseStaff,
    };

    const inventoryReport =
      await this.inventoryReportService.createInventoryReport(
        inventoryReportInput,
        warehouseStaffId,
        prismaInstance,
      );
    if (!inventoryReport) {
      throw new BadRequestException('Create inventory report failed');
    }
    const result = await prismaInstance.inventoryReportPlanDetail.updateMany({
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

    return apiSuccess(200, {}, 'Inventory report plan processed successfully');
  }
  findById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Id is not valid');
    }
    return this.prismaService.inventoryReportPlan.findUnique({
      where: { id },
      include: inventoryReportPlan,
    });
  }

  async getAllInventoryReportPlanByWarehouseStaff(
    warehouseStaffId: string,
    findOptions: GeneratedFindOptions<Prisma.InventoryReportPlanWhereInput>,
  ) {
    const { skip, take, ...rest } = findOptions;
    const page = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.inventoryReportPlan.findMany({
        where: {
          AND: [
            {
              inventoryReportPlanDetail: {
                some: {
                  warehouseStaffId,
                },
              },
            },
            rest.where,
          ].filter(Boolean),
        },
        include: inventoryReportPlan,
        skip: page,
        take: limit,
        orderBy: findOptions?.orderBy,
      }),
      this.prismaService.inventoryReportPlan.count({
        where: {
          AND: [
            {
              inventoryReportPlanDetail: {
                some: {
                  warehouseStaffId,
                },
              },
            },
            rest?.where,
          ].filter(Boolean),
        },
      }),
    ]);

    result.forEach((inventoryReportPlan: any) => {
      const groupedByStaff =
        inventoryReportPlan.inventoryReportPlanDetail.reduce(
          (acc, detail) => {
            const staffId = detail.warehouseStaffId;

            if (!acc[staffId]) {
              acc[staffId] = {
                warehouseStaff: detail.warehouseStaff,
                inventoryReport: detail.inventoryReport,
                staffInventoryReportPlanDetails: [],
              };
            }
            acc[staffId].staffInventoryReportPlanDetails.push(detail);
            return acc;
          },
          {} as Record<
            string,
            {
              // warehouseStaffId: string;
              inventoryReport?: string;
              warehouseStaff: any;
              staffInventoryReportPlanDetails: any[];
            }
          >,
        );
      // Replace with grouped data
      inventoryReportPlan.inventoryReportPlanDetail =
        Object.values(groupedByStaff);
    });

    // Step 2: Group each warehouseStaff's details by materialVariantId or productVariantId
    result.forEach((inventoryReportPlan: any) => {
      inventoryReportPlan.inventoryReportPlanDetail.forEach(
        (staffGroup: any) => {
          const groupedByMaterialOrProduct =
            staffGroup.staffInventoryReportPlanDetails.reduce(
              (acc, detail) => {
                // Check for materialVariant grouping
                if (detail.materialVariant) {
                  const materialVariantId = detail.materialVariant.id;

                  if (!acc[materialVariantId]) {
                    acc[materialVariantId] = {
                      materialVariant: detail.materialVariant,
                      packagePlanDetails: [],
                    };
                  }

                  acc[materialVariantId].packagePlanDetails =
                    detail.materialVariant.materialPackage;
                }

                // Check for productVariant grouping
                else if (detail.productVariant) {
                  const productVariantId = detail.productVariant.id;

                  if (!acc[productVariantId]) {
                    acc[productVariantId] = {
                      productVariant: detail.productVariant,
                      sizePlanDetails: [],
                    };
                  }

                  acc[productVariantId].sizePlanDetails =
                    detail.productVariant.productSize;
                }

                return acc;
              },
              {} as Record<
                string,
                {
                  materialVariant?: any;
                  productVariant?: any;
                  packagePlanDetails?: any[];
                  sizePlanDetails?: any[];
                }
              >,
            );

          // Replace staffGroup details with grouped data
          staffGroup.staffInventoryReportPlanDetails = Object.values(
            groupedByMaterialOrProduct,
          );
        },
      );
    });

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'Get all inventory report plan by warehouse staff successfully',
    );
  }

  async create(
    createInventoryReportPlanDto: CreateInventoryReportPlanDto,
    warehouseManagerId: string,
  ) {
    const inventoryPlanInput: Prisma.InventoryReportPlanCreateInput = {
      code: undefined,
      type: createInventoryReportPlanDto.inventoryReportPlanType,
      title: createInventoryReportPlanDto.title,
      from: createInventoryReportPlanDto.from,
      to: createInventoryReportPlanDto.to,
      note: createInventoryReportPlanDto.note,
      warehouseManager: {
        connect: { id: warehouseManagerId },
      },
    };

    const isInventoryPlanValid = await this.validateInventoryReportPlan(
      createInventoryReportPlanDto,
    );

    if (isInventoryPlanValid.length > 0) {
      return apiFailed(
        409,
        'Inventory report plan in time range already exists',
        isInventoryPlanValid,
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
              materialVariantId: el.materialVariantId,
              productVariantId: el.productVariantId,
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
      {
        timeout: 100000,
      },
    );
    const createTaskDto: CreateTaskDto[] = [];

    const staffList = Array.from(
      new Set(
        result.inventoryReportPlanDetail.reduce(
          (acc, plan) => acc.concat(plan.warehouseStaffId),
          [] as string[],
        ),
      ),
    );
    staffList.forEach((staff: any) => {
      createTaskDto.push({
        status: 'OPEN',
        taskType: TaskType.INVENTORY,
        warehouseStaffId: staff,
        inventoryReportPlanId: result.id,
        expectedStartedAt: createInventoryReportPlanDto.from,
        expectedFinishedAt: createInventoryReportPlanDto.to,
      });
    });
    await this.taskService.createMany(createTaskDto);
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
    createInventoryReportPlanDto:
      | CreateInventoryReportPlanDto
      | CreateOverAllInventoryReportPlanDto,
  ) {
    const inventoryPlanInTimeRange = await this.getAllReportPlanInTimeRange(
      createInventoryReportPlanDto.from,
      createInventoryReportPlanDto.to,
    );
    return inventoryPlanInTimeRange;
  }

  async getAllReportPlanInTimeRange(from: Date, to?: Date) {
    const result = await this.prismaService.inventoryReportPlan.findMany({
      where: {
        AND: [
          {
            from: to ? { lte: to } : undefined,
          },
          {
            to: from ? { gte: from } : undefined,
          },
          {
            status: {
              notIn: [
                InventoryReportPlanStatus.CANCELLED,
                InventoryReportPlanStatus.FINISHED,
              ],
            },
          },
        ].filter(Boolean),
      },
    });
    return result;
  }

  async findAll(
    findOptions: GeneratedFindOptions<Prisma.InventoryReportPlanWhereInput>,
  ) {
    const result = await this.prismaService.inventoryReportPlan.findMany({
      where: findOptions.where,
      include: inventoryReportPlan, // Ensure this includes relevant relations
    });

    // Step 1: Group by warehouseStaffId
    result.forEach((inventoryReportPlan: any) => {
      const groupedByStaff =
        inventoryReportPlan.inventoryReportPlanDetail.reduce(
          (acc, detail) => {
            const staffId = detail.warehouseStaffId;

            if (!acc[staffId]) {
              acc[staffId] = {
                warehouseStaff: detail.warehouseStaff,
                inventoryReport: detail.inventoryReport,
                staffInventoryReportPlanDetails: [],
              };
            }

            acc[staffId].staffInventoryReportPlanDetails.push(detail);
            return acc;
          },
          {} as Record<
            string,
            {
              // warehouseStaffId: string;
              inventoryReport?: string;
              warehouseStaff: any;
              staffInventoryReportPlanDetails: any[];
            }
          >,
        );

      // Replace with grouped data
      inventoryReportPlan.inventoryReportPlanDetail =
        Object.values(groupedByStaff);
    });

    // Step 2: Group each warehouseStaff's details by materialVariantId or productVariantId
    result.forEach((inventoryReportPlan: any) => {
      inventoryReportPlan.inventoryReportPlanDetail.forEach(
        (staffGroup: any) => {
          const groupedByMaterialOrProduct =
            staffGroup.staffInventoryReportPlanDetails.reduce(
              (acc, detail) => {
                // Check for materialVariant grouping
                if (detail.materialPackage?.materialVariant) {
                  const materialVariantId =
                    detail.materialPackage.materialVariant.id;

                  if (!acc[materialVariantId]) {
                    acc[materialVariantId] = {
                      materialVariant: detail.materialPackage.materialVariant,
                      packagePlanDetails: [],
                    };
                  }

                  acc[materialVariantId].packagePlanDetails.push(
                    detail.materialPackage,
                  );
                }

                // Check for productVariant grouping
                else if (detail.productSize?.productVariant) {
                  const productVariantId = detail.productSize.productVariant.id;

                  if (!acc[productVariantId]) {
                    acc[productVariantId] = {
                      productVariant: detail.productSize.productVariant,
                      sizePlanDetails: [],
                    };
                  }

                  acc[productVariantId].sizePlanDetails.push(
                    detail.productSize,
                  );
                }

                return acc;
              },
              {} as Record<
                string,
                {
                  materialVariant?: any;
                  productVariant?: any;
                  packagePlanDetails?: any[];
                  sizePlanDetails?: any[];
                }
              >,
            );

          // Replace staffGroup details with grouped data
          staffGroup.staffInventoryReportPlanDetails = Object.values(
            groupedByMaterialOrProduct,
          );
        },
      );
    });

    return apiSuccess(
      200,
      result,
      'Get all inventory report plans successfully',
    );
  }

  async findOne(id: string) {
    const result = await this.prismaService.inventoryReportPlan.findMany({
      where: { id },
      include: inventoryReportPlan,
    });

    result.forEach((inventoryReportPlan: any) => {
      const groupedByStaff =
        inventoryReportPlan.inventoryReportPlanDetail.reduce(
          (acc, detail) => {
            const staffId = detail.warehouseStaffId;

            if (!acc[staffId]) {
              acc[staffId] = {
                warehouseStaff: detail.warehouseStaff,
                inventoryReport: detail.inventoryReport,
                staffInventoryReportPlanDetails: [],
              };
            }
            acc[staffId].staffInventoryReportPlanDetails.push(detail);
            return acc;
          },
          {} as Record<
            string,
            {
              // warehouseStaffId: string;
              inventoryReport?: string;
              warehouseStaff: any;
              staffInventoryReportPlanDetails: any[];
            }
          >,
        );
      // Replace with grouped data
      inventoryReportPlan.inventoryReportPlanDetail =
        Object.values(groupedByStaff);
    });

    // Step 2: Group each warehouseStaff's details by materialVariantId or productVariantId
    result.forEach((inventoryReportPlan: any) => {
      inventoryReportPlan.inventoryReportPlanDetail.forEach(
        (staffGroup: any) => {
          const groupedByMaterialOrProduct =
            staffGroup.staffInventoryReportPlanDetails.reduce(
              (acc, detail) => {
                // Check for materialVariant grouping
                if (detail.materialVariant) {
                  const materialVariantId = detail.materialVariant.id;

                  if (!acc[materialVariantId]) {
                    acc[materialVariantId] = {
                      materialVariant: detail.materialVariant,
                      packagePlanDetails: [],
                    };
                  }

                  acc[materialVariantId].packagePlanDetails =
                    detail.materialVariant.materialPackage;
                }

                // Check for productVariant grouping
                else if (detail.productVariant) {
                  const productVariantId = detail.productVariant.id;

                  if (!acc[productVariantId]) {
                    acc[productVariantId] = {
                      productVariant: detail.productVariant,
                      sizePlanDetails: [],
                    };
                  }

                  acc[productVariantId].sizePlanDetails =
                    detail.productVariant.productSize;
                }

                return acc;
              },
              {} as Record<
                string,
                {
                  materialVariant?: any;
                  productVariant?: any;
                  packagePlanDetails?: any[];
                  sizePlanDetails?: any[];
                }
              >,
            );

          // Replace staffGroup details with grouped data
          staffGroup.staffInventoryReportPlanDetails = Object.values(
            groupedByMaterialOrProduct,
          );
        },
      );
    });

    if (result.length > 0) {
      return apiSuccess(
        200,
        result[0],
        'Get inventory report plan successfully',
      );
    }
    return apiFailed(404, 'Inventory report plan not found');
  }

  update(
    id: number,
    updateInventoryReportPlanDto: UpdateInventoryReportPlanDto,
  ) {
    return `This action updates a #${id} inventoryReportPlan`;
  }

  async remove(id: string) {
    const result = await this.prismaService.inventoryReportPlan.delete({
      where: { id },
    });

    await this.prismaService.inventoryReportPlanDetail.deleteMany({
      where: {
        inventoryReportPlanId: id,
      },
    });

    if (result) {
      return apiSuccess(
        200,
        result,
        'Inventory report plan deleted successfully',
      );
    }
  }
}
