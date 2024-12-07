import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import {
  DefaultArgs,
  PayloadToResult,
  RenameAndNestPayloadKeys,
} from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { ChangeFieldDto } from './dto/change-field.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
  ) {}

  @OnEvent('notification.importRequest.updated')
  async handleNotificationImportRequestUpdatedEvent(
    importRequest: ChangeFieldDto,
    importRequestId: string,
  ) {
    console.log('importRequest', importRequest);
  }

  @OnEvent('notification.task.created')
  async handleNotificationTaskCreateEvent(
    task: PayloadToResult<
      Prisma.$TaskPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$TaskPayload<DefaultArgs>>
    >,
  ) {
    Logger.log('notification.task.created', task);
    let message;
    let path;
    let taskType;
    if (task.importRequestId) {
      message = `New Task ${task.code} has been created for Import Request ${task.importRequest.code}`;
      path = `/import-request/${task.importRequestId}`;
      taskType = 'IMPORT';
    }
    if (task.inspectionRequestId) {
      message = `New Task ${task.code} has been created for Inspection Request ${task.inspectionRequest.code}`;
      path = `/inspection-request/${task.inspectionRequestId}`;
      taskType = 'INSPECTION';
    }
    if (task.inventoryReportPlanId) {
      message = `New Task ${task.code} has been created for Inventory Report Plan ${task.inventoryReportPlan.code}`;
      path = `/inventory-report-plan/${task.inventoryReportPlanId}`;
    }
    if (task.materialExportReceiptId) {
      message = `New Task ${task.code} has been created for Material Export Receipt ${task.materialExportReceipt.code}`;
      path = `/material-export-receipt/${task.materialExportReceiptId}`;
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
    this.notificationGateway.create(result);
  }

  @OnEvent('notification.task.many.created')
  async handleNotificationTaskManyCreateEvent(
    tasks: PayloadToResult<
      Prisma.$TaskPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$TaskPayload<DefaultArgs>>
    >[],
  ) {
    console.log('tasks', tasks);
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
            message: `New Import Request ${importRequest.code} has been created by purchasing staff and waiting for approval`,
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
