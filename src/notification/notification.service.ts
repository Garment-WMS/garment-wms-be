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
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
  ) {}
  @OnEvent('notification.importRequest.created')
  async handleNotificationImportRequestCreatedEvent(
    importRequest: PayloadToResult<
      Prisma.$ImportRequestPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$ImportRequestPayload<DefaultArgs>>
    >,
  ) {
    Logger.debug('Handling notification.importRequest.created event');
    const warehouseManagers = await this.prismaService.account.findMany({
      where: {
        warehouseManager: {
          NOT: null,
        },
      },
    });
    const createNotificationPromises = warehouseManagers.map(
      async (warehouseManager) => {
        return this.prismaService.notification.create({
          data: {
            title: `New Import Request ${importRequest.code}`,
            message: `New Import Request ${importRequest.code} has been created by purchasing staff and waiting for approval`,
            path: `/import-request/${importRequest.id}`,
            accountId: warehouseManager.id,
          },
        });
      },
    );
    await Promise.all(createNotificationPromises);
  }

  async create(
    notificationUncheckedCreateInput: Prisma.NotificationUncheckedCreateInput,
  ) {
    this.notificationGateway.server.emit(
      'newNotification',
      notificationUncheckedCreateInput,
    );
    return this.prismaService.notification.create({
      data: notificationUncheckedCreateInput,
    });
  }

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
}
