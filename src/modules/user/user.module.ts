import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImageModule } from '../image/image.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IsUserRoleExistValidator } from './validator/is-user-of-role-exist.validator';
import { ReceiptAdjustmentModule } from '../receipt-adjustment/receipt-adjustment.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [UserController],
  imports: [
    PrismaModule,
    ImageModule,
    ReceiptAdjustmentModule,
    
  ],
  providers: [UserService, IsUserRoleExistValidator],
  exports: [UserService],
})
export class UserModule {}
