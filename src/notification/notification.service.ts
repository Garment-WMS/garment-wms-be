import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ImportRequestStatus,
  InventoryReportPlan,
  InventoryReportPlanStatus,
  MaterialExportRequest,
  MaterialExportRequestStatus,
  NotificationType,
  Prisma,
  RoleCode,
} from '@prisma/client';
import {
  DefaultArgs,
  PayloadToResult,
  RenameAndNestPayloadKeys,
} from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';
import { formatDate } from 'src/common/utils/utils';
import { InventoryStockService } from 'src/modules/inventory-stock/inventory-stock.service';
import { MaterialVariantService } from 'src/modules/material-variant/material-variant.service';
import { UserService } from 'src/modules/user/user.service';
import { ChangeFieldDto } from './dto/change-field.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
    private readonly inventoryStockService: InventoryStockService,
    private readonly materialVariantService: MaterialVariantService,
  ) {}

  @OnEvent('notification.inventoryReportPlan.updated')
  async inventoryReportPlanStatusUpdatedEvent({
    changeField,
    inventoryReportPlanId,
  }: {
    changeField: ChangeFieldDto;
    inventoryReportPlanId: string;
  }) {
    const inventoryReportPlan =
      await this.prismaService.inventoryReportPlan.findUnique({
        where: {
          id: inventoryReportPlanId,
        },
        include: {
          inventoryReportPlanDetail: {
            include: {
              warehouseStaff: {
                include: {
                  account: true,
                },
              },
            },
          },
        },
      });
    const warehouseStaffSet = new Set(
      inventoryReportPlan.inventoryReportPlanDetail.map(
        (detail) => detail.warehouseStaff,
      ),
    );
    console.log('warehouseStaffSet', warehouseStaffSet);
    console.log('changeField', changeField);
    console.log('inventoryReportPlan', inventoryReportPlan);
    if (
      changeField?.status.after === InventoryReportPlanStatus.IN_PROGRESS ||
      changeField?.status.before === InventoryReportPlanStatus.IN_PROGRESS
    ) {
      const createNotificationPromises = Array.from(warehouseStaffSet).map(
        async (warehouseStaff) => {
          return this.prismaService.notification.create({
            data: {
              title: `Inventory Report Plan ${inventoryReportPlan.code} has been started`,
              message: `Inventory Report Plan ${inventoryReportPlan.code} has been started`,
              path: `/stocktaking/plan/${inventoryReportPlan.id}`,
              accountId: warehouseStaff.accountId,
              type: 'INVENTORY_REPORT',
            },
          });
        },
      );
      const result = await Promise.all(createNotificationPromises);
      result.map((createNotificationPromises) => {
        this.notificationGateway.create(createNotificationPromises);
      });
    }
  }
  @OnEvent('notification.inventoryReport.record')
  async inventoryReportRecordEvent(inventoryReportId: string) {
    const inventoryReport = await this.prismaService.inventoryReport.findUnique(
      {
        where: {
          id: inventoryReportId,
        },
        include: {
          inventoryReportPlanDetail: {
            include: {
              inventoryReportPlan: {
                include: {
                  warehouseManager: true,
                },
              },
            },
          },
        },
      },
    );
    const createNotificationPromises =
      await this.prismaService.notification.create({
        data: {
          title: ` Inventory Report ${inventoryReport.code} has been recorded`,
          message: ` Inventory Report ${inventoryReport.code} has been recorded`,
          path: `/stocktaking/${inventoryReport.id}`,
          accountId:
            inventoryReport.inventoryReportPlanDetail[0].inventoryReportPlan
              .warehouseManager.accountId,
          type: 'INVENTORY_REPORT',
        },
      });
    return await this.notificationGateway.create(createNotificationPromises);
  }

  @OnEvent('notification.inventoryReportPlan.created')
  async inventoryReportPlanCreatedEvent(
    inventoryReportPlan: InventoryReportPlan,
  ) {
    let allAccount = [];
    const warehouseStaffs = await this.userService.getAllUserByRole(
      RoleCode.WAREHOUSE_STAFF,
    );
    const purchasingStaffs = await this.userService.getAllUserByRole(
      RoleCode.PURCHASING_STAFF,
    );
    const warehouseManager = await this.userService.getAllUserByRole(
      RoleCode.WAREHOUSE_MANAGER,
    );
    const productionDepartment = await this.userService.getAllUserByRole(
      RoleCode.PRODUCTION_DEPARTMENT,
    );
    const factoryDirector = await this.userService.getAllUserByRole(
      RoleCode.FACTORY_DIRECTOR,
    );
    const inspectionDepartment = await this.userService.getAllUserByRole(
      RoleCode.INSPECTION_DEPARTMENT,
    );
    allAccount = [
      ...warehouseStaffs.data,
      ...purchasingStaffs.data,
      ...warehouseManager.data,
      ...productionDepartment.data,
      ...factoryDirector.data,
      ...inspectionDepartment.data,
    ];
    const createNotificationPromises = allAccount.map(async (account) => {
      return this.prismaService.notification.create({
        data: {
          title: `New Inventory Report Plan ${inventoryReportPlan.code} has been created`,
          message: `New Inventory Report Plan ${inventoryReportPlan.code} has been created, take place from ${formatDate(inventoryReportPlan.from)} to ${formatDate(inventoryReportPlan.to)}`,
          accountId: account.accountId,
          path: `/stocktaking/plan/${inventoryReportPlan.id}`,
          type: 'INVENTORY_REPORT',
        },
      });
    });
    const result = await Promise.all(createNotificationPromises);
    result.map((createNotificationPromises) => {
      this.notificationGateway.create(createNotificationPromises);
    });
  }

  @OnEvent('notification.inventoryStock.updated')
  async updateInventoryStockNotificationEvent({ changes, inventoryStockId }) {
    const inventoryStock =
      await this.inventoryStockService.findOne(inventoryStockId);
    if (inventoryStock.materialPackageId !== null) {
      const materialVariant = inventoryStock.materialPackage.materialVariant;
      const { isAtReorderAlert: isAtReorderLevelAlert, currentQuantityByUom } =
        await this.materialVariantService.isMaterialVariantAtReOrderLevel(
          materialVariant.id,
        );
      if (isAtReorderLevelAlert) {
        const { result: reorderAlert, operation } =
          await this.materialVariantService.createReOrderAlert(
            materialVariant.id,
            currentQuantityByUom,
            materialVariant.reorderLevel,
          );
        //Mean new reorder alert is created
        if (operation.toLocaleUpperCase() === 'CREATED') {
          const purchasingStaffs = (
            await this.userService.getAllUserByRole(RoleCode.PURCHASING_STAFF)
          ).data;
          const createNotificationPromises = purchasingStaffs.map(
            async (purchasingStaff) => {
              return this.prismaService.notification.create({
                data: {
                  title: `Reorder Level of Material Variant ${materialVariant.code}`,
                  message: `Material Variant ${materialVariant.code} has reached the reorder level`,
                  path: `/material-variant/${materialVariant.id}`,
                  accountId: purchasingStaff.accountId,
                  type: 'REORDER_LEVEL',
                },
              });
            },
          );
          const result = await Promise.all(createNotificationPromises);
          result.map((createNotificationPromises) => {
            this.notificationGateway.create(createNotificationPromises);
          });
        }
      } else {
        const { result: reorderAlert, operation } =
          await this.materialVariantService.updateReorderAlert(
            materialVariant.id,
            currentQuantityByUom,
            materialVariant.reorderLevel,
          );
        if (reorderAlert || operation.toUpperCase() === 'UPDATED') {
          const purchasingStaffs = (
            await this.userService.getAllUserByRole(RoleCode.PURCHASING_STAFF)
          ).data;
          const createNotificationPromises = purchasingStaffs.map(
            async (purchasingStaff) => {
              return this.prismaService.notification.create({
                data: {
                  title: `Reorder Level of Material Variant ${materialVariant.code}`,
                  message: `Material Variant ${materialVariant.code} has been filled up and no longer at reorder level`,
                  path: `/material-variant/${materialVariant.id}`,
                  accountId: purchasingStaff.accountId,
                  type: 'REORDER_LEVEL',
                },
              });
            },
          );
          const result = await Promise.all(createNotificationPromises);
          result.map((createNotificationPromises) => {
            this.notificationGateway.create(createNotificationPromises);
          });
        }
      }
    }
  }

  @OnEvent('notification.importRequest.updated')
  async handleNotificationImportRequestUpdatedEvent(payload: {
    changeField: ChangeFieldDto;
    importRequestId: string;
  }) {
    const { changeField, importRequestId } = payload;
    const importRequest = await this.findUniqueForNotification(importRequestId);
    if (changeField?.status.after === ImportRequestStatus.INSPECTED) {
      const notification =
        await this.prismaService.notification.createManyAndReturn({
          data: [
            {
              title: `Import Request ${importRequest.code} has been inspected`,
              message: `Import Request ${importRequest.code} has been inspected and waiting for importing`,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',
              accountId: importRequest.warehouseManager.accountId,
            },
            {
              title: `Import Request ${importRequest.code} has been inspected`,
              message: `Import Request ${importRequest.code} has been inspected and waiting for importing`,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',
              accountId: importRequest.warehouseStaff.accountId,
            },
            {
              title: `Import Request ${importRequest.code} has been inspected`,
              message: `Import Request ${importRequest.code} has been inspected and waiting for importing`,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',

              accountId: importRequest.purchasingStaff.accountId,
            },
          ],
        });
      notification.map((notification) => {
        this.notificationGateway.create(notification);
      });
    } else if (changeField?.status.after === ImportRequestStatus.IMPORTING) {
      const notification =
        await this.prismaService.notification.createManyAndReturn({
          data: [
            {
              title: `Import Request ${importRequest.code} is importing`,
              message: `Import Request ${importRequest.code} is importing`,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',

              accountId: importRequest.warehouseManager.accountId,
            },
            {
              title: `Import Request ${importRequest.code} is importing`,
              message: `Import Request ${importRequest.code} is importing`,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',
              accountId: importRequest.purchasingStaff.accountId,
            },
          ],
        });
      notification.map((notification) => {
        this.notificationGateway.create(notification);
      });
    } else if (changeField?.status.after === ImportRequestStatus.IMPORTED) {
      const notification =
        await this.prismaService.notification.createManyAndReturn({
          data: [
            {
              title: `Import Request ${importRequest.code} has been imported`,
              message: `Import Request ${importRequest.code} has been imported`,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',
              accountId: importRequest.warehouseManager.accountId,
            },
            {
              title: `Import Request ${importRequest.code} has been imported`,
              message: `Import Request ${importRequest.code} has been imported`,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',
              accountId: importRequest.purchasingStaff.accountId,
            },
          ],
        });
      notification.map((notification) => {
        this.notificationGateway.create(notification);
      });
    } else if (changeField?.status.after === ImportRequestStatus.CANCELLED) {
      let message = `Import Request ${importRequest.code} has been cancelled`;
      let title = importRequest?.inspectionRequest
        ? `Import Request ${importRequest.code} has been cancelled because there is no approved materials`
        : `Import Request ${importRequest.code} has been cancelled`;
      const notification =
        await this.prismaService.notification.createManyAndReturn({
          data: [
            {
              title: title,
              message: message,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',
              accountId: importRequest.warehouseManager.accountId,
            },
            {
              title: title,
              message: message,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',
              accountId: importRequest.purchasingStaff.accountId,
            },
          ],
        });
      notification.map((notification) => {
        this.notificationGateway.create(notification);
      });
    } else if (changeField?.status.after === ImportRequestStatus.APPROVED) {
      const notification =
        await this.prismaService.notification.createManyAndReturn({
          data: [
            {
              title: `Import Request ${importRequest.code} has been approved`,
              message: `Import Request ${importRequest.code} has been approved`,
              path: `/import-request/${importRequest.id}`,
              type: 'IMPORT_REQUEST',
              accountId: importRequest.purchasingStaff.accountId,
            },
          ],
        });
      notification.map((notification) => {
        this.notificationGateway.create(notification);
      });
    }
  }

  async findUniqueForNotification(id: string) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
      include: {
        inspectionRequest: true,
        warehouseStaff: {
          include: {
            account: true,
          },
        },
        purchasingStaff: {
          include: {
            account: true,
          },
        },
        warehouseManager: {
          include: {
            account: true,
          },
        },
      },
    });
    return importRequest;
  }
  @OnEvent('notification.task.created')
  async handleNotificationTaskCreateEvent(
    task: PayloadToResult<
      Prisma.$TaskPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$TaskPayload<DefaultArgs>>
    >,
  ) {
    let message: string;
    let path: string;
    let taskType: NotificationType;
    if (task.importRequestId) {
      message = `New Task ${task.code} has been created for Import Request ${task.importRequest.code}`;
      path = `/import-request/${task.importRequestId}`;
      taskType = 'IMPORT_REQUEST';
    } else if (task.inspectionRequestId) {
      message = `New Task ${task.code} has been created for Inspection Request ${task.inspectionRequest.code}`;
      path = `/inspection-request/${task.inspectionRequestId}`;
      taskType = 'INSPECTION_REQUEST';
    } else if (task.inventoryReportPlanId) {
      message = `New Task ${task.code} has been created for Inventory Report Plan ${task.inventoryReportPlan.code}`;
      path = `/stocktaking/plan/${task.inventoryReportPlanId}`;
      taskType = 'INVENTORY_REPORT';
    } else if (task.materialExportReceiptId) {
      message = `New Task ${task.code} has been created for Material Export Receipt ${task.materialExportReceipt.code}`;
      path = `/export-receipt/${task.materialExportReceiptId}`;
      taskType = 'MATERIAL_EXPORT_RECEIPT';
    } else {
      //todo
    }
    const result = await this.prismaService.notification.create({
      data: {
        title: `New Task ${task.code}`,
        message: `${message}`,
        path: `${path}`,
        accountId: `${task.inspectionDepartmentId ? task.inspectionDepartment.accountId : task.warehouseStaff.accountId}`,
      },
    });
    // const result = await Promise.all(createNotificationPromises);
    Logger.log('notification.task.created', result);
    this.notificationGateway.create(result);
  }

  @OnEvent('notification.task.many.created')
  async handleNotificationTaskManyCreateEvent(
    tasks: PayloadToResult<
      Prisma.$TaskPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$TaskPayload<DefaultArgs>>
    >[],
  ) {
    const createNotificationPromises = tasks.map((task) => {
      let message;
      let path;
      if (task.importRequestId && task.taskType === 'IMPORT') {
        message = `New Task ${task.code} has been created for Import Request ${task.importRequest.code}`;
        path = `/import-request/${task.importRequestId}`;
      }
      if (task.inspectionRequestId && task.taskType === 'INSPECTION') {
        message = `New Task ${task.code} has been created for Inspection Request ${task.inspectionRequest.code}`;
        path = `/inspection-request/${task.inspectionRequestId}`;
      }
      if (task.inventoryReportPlanId) {
        message = `New Task ${task.code} has been created for Inventory Report Plan ${task.inventoryReportPlan.code}`;
        path = `/inventory-report-plan/${task.inventoryReportPlanId}`;
      }
      if (task.materialExportReceiptId) {
        message = `New Task ${task.code} has been created for Material Export Receipt ${task.materialExportReceipt.code}`;
        path = `/material-export-receipt/${task.materialExportReceiptId}`;
      }
      return this.prismaService.notification.create({
        data: {
          title: `New Task ${task.code}`,
          message: `${message}`,
          path: `${path}`,
          accountId: `${task.inspectionDepartmentId ? task.inspectionDepartment.accountId : task.warehouseStaff.accountId}`,
        },
      });
    });
    const result = await Promise.all(createNotificationPromises);
    result.map((createNotificationPromises) => {
      this.notificationGateway.create(createNotificationPromises);
    });
  }

  @OnEvent('notification.importRequest.created')
  async handleNotificationImportRequestCreatedEvent(
    importRequest: PayloadToResult<
      Prisma.$ImportRequestPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$ImportRequestPayload<DefaultArgs>>
    >,
  ) {
    const warehouseManagers =
      await this.prismaService.warehouseManager.findMany();
    const createNotificationPromises = warehouseManagers.map(
      async (warehouseManager) => {
        return this.prismaService.notification.create({
          data: {
            title: `New Import Request ${importRequest.code}`,
            message: `New Import Request ${importRequest.code} has been created by ${importRequest?.poDeliveryId ? 'purchasing staff' : 'production department'} and waiting for approval`,
            path: `/import-request/${importRequest.id}`,
            accountId: warehouseManager.accountId,
          },
        });
      },
    );
    const result = await Promise.all(createNotificationPromises);
    result.map((createNotificationPromises) => {
      this.notificationGateway.create(createNotificationPromises);
    });
  }

  @OnEvent('notification.materialExportRequest.created')
  async handleNotificationMaterialExportRequestCreatedEvent(
    materialExportRequest: PayloadToResult<
      Prisma.$MaterialExportRequestPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<
        Prisma.$MaterialExportRequestPayload<DefaultArgs>
      >
    >,
  ) {
    const warehouseManagers =
      await this.prismaService.warehouseManager.findMany();
    const createNotificationPromises = warehouseManagers.map(
      async (warehouseManager) => {
        return this.prismaService.notification.create({
          data: {
            title: `New Material Export Request ${materialExportRequest.code}`,
            message: `New Material Export Request ${materialExportRequest.code} has been created by Production department and waiting for approval`,
            path: `/export-request/${materialExportRequest.id}`,
            accountId: warehouseManager.accountId,
          },
        });
      },
    );
    const result = await Promise.all(createNotificationPromises);
    result.map((createNotificationPromises) => {
      this.notificationGateway.create(createNotificationPromises);
    });
  }

  // @OnEvent('notification.materialExportRequest.updated')
  async handleNotificationMaterialExportRequestUpdatedEvent(
    materialExportRequestChanges: ChangeFieldDto,
    materialExportRequest: MaterialExportRequest,
  ) {
    if (!materialExportRequestChanges.status) return;
    const status = materialExportRequestChanges.status
      .after as MaterialExportRequestStatus;
    switch (status) {
      case 'APPROVED':
      case 'REJECTED':
        const productionDepartment =
          await this.prismaService.productionDepartment.findUnique({
            where: {
              id: materialExportRequest.productionDepartmentId,
            },
            select: {
              accountId: true,
            },
          });
        const notification = await this.prismaService.notification.create({
          data: {
            title: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            message: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            path: `/export-request/${materialExportRequest.id}`,
            accountId: productionDepartment.accountId,
          },
        });
        this.notificationGateway.create(notification);
        break;
      case 'EXPORTED':
        const productionDepartment2 =
          await this.prismaService.productionDepartment.findUnique({
            where: {
              id: materialExportRequest.productionDepartmentId,
            },
            select: {
              accountId: true,
            },
          });
        const notification2 = await this.prismaService.notification.create({
          data: {
            title: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            message: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            path: `/export-request/${materialExportRequest.id}`,
            accountId: productionDepartment2.accountId,
          },
        });
        this.notificationGateway.create(notification2);
        break;
      case 'PRODUCTION_APPROVED':
      case 'PRODUCTION_REJECTED':
      case 'RETURNED':
        const warehouseManager =
          await this.prismaService.warehouseManager.findUnique({
            where: {
              id: materialExportRequest.warehouseManagerId,
            },
            select: {
              accountId: true,
            },
          });
        const notification3 = await this.prismaService.notification.create({
          data: {
            title: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            message: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            path: `/export-request/${materialExportRequest.id}`,
            accountId: warehouseManager.accountId,
          },
        });
        this.notificationGateway.create(notification3);
      default:
    }
  }

  @OnEvent('notification.materialExportRequest.updated')
  async handleNotificationMaterialExportRequestUpdatedEventUseForListener(payload: {
    changeFieldDto: ChangeFieldDto;
    materialExportRequest: MaterialExportRequest;
  }) {
    console.log('payload', payload);
    const { changeFieldDto, materialExportRequest } = payload;
    console.log('changeFieldDto', changeFieldDto);
    if (!changeFieldDto.status) return;
    const materialExportRequestChanges = changeFieldDto;
    if (!materialExportRequestChanges.status) return;
    const status = materialExportRequestChanges.status
      .after as MaterialExportRequestStatus;
    switch (status) {
      case 'APPROVED':
      case 'REJECTED':
        const productionDepartment =
          await this.prismaService.productionDepartment.findUnique({
            where: {
              id: materialExportRequest.productionDepartmentId,
            },
            select: {
              accountId: true,
            },
          });
        const notification = await this.prismaService.notification.create({
          data: {
            title: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            message: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            path: `/export-request/${materialExportRequest.id}`,
            accountId: productionDepartment.accountId,
          },
        });
        console.log('notification', notification);
        this.notificationGateway.create(notification);
        break;
      case 'EXPORTED':
        const productionDepartment2 =
          await this.prismaService.productionDepartment.findUnique({
            where: {
              id: materialExportRequest.productionDepartmentId,
            },
            select: {
              accountId: true,
            },
          });
        const notification2 = await this.prismaService.notification.create({
          data: {
            title: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            message: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            path: `/export-request/${materialExportRequest.id}`,
            accountId: productionDepartment2.accountId,
          },
        });
        this.notificationGateway.create(notification2);
        break;
      case 'PRODUCTION_APPROVED':
      case 'PRODUCTION_REJECTED':
      case 'RETURNED':
        const warehouseManager =
          await this.prismaService.warehouseManager.findUnique({
            where: {
              id: materialExportRequest.warehouseManagerId,
            },
            select: {
              accountId: true,
            },
          });
        const notification3 = await this.prismaService.notification.create({
          data: {
            title: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            message: `Material Export Request ${materialExportRequest.code} has been ${materialExportRequestChanges.status.after}`,
            path: `/export-request/${materialExportRequest.id}`,
            accountId: warehouseManager.accountId,
          },
        });
        this.notificationGateway.create(notification3);
      default:
    }
  }
  // async create(
  //   notificationUncheckedCreateInput: Prisma.NotificationUncheckedCreateInput,
  // ) {
  //   await this.notificationGateway.create(notificationUncheckedCreateInput);
  // }

  async findAll() {
    return this.prismaService.notification.findMany();
  }

  async findByUserId(userId: string) {
    return this.prismaService.notification.findMany({
      where: {
        accountId: userId,
      },
    });
  }

  async findUnique(id: string) {
    const notification = await this.prismaService.notification.findUnique({
      where: {
        id,
      },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async findUniqueAndUpdateRead(id: string) {
    const notification = await this.findUnique(id);
    return this.prismaService.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async test() {
    return this.notificationGateway.server.emit(
      'newNotification',
      'Message emit from notification service',
    );
  }
}
