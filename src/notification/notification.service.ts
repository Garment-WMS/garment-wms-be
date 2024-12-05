import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationGateway } from './notification.gateway';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
  ) {}
  @OnEvent('notification.importRequest.created')
  async handleNotificationImportRequestCreatedEvent(payload: any) {
    const allManager = await this.userService.getAllUserByRole('WAREHOUSE_MANAGER');
    
  }

  async create(createNotificationDto: CreateNotificationDto) {
    this.notificationGateway.server.emit(
      'newNotification',
      createNotificationDto,
    );
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}