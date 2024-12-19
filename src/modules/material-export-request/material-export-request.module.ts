import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ChatModule } from '../chat/chat.module';
import { DiscussionModule } from '../discussion/discussion.module';
import { MaterialExportReceiptModule } from '../material-export-receipt/material-export-receipt.module';
import { ProductionBatchModule } from '../production-batch/production-batch.module';
import { TaskModule } from '../task/task.module';
import { MaterialExportRequestController } from './material-export-request.controller';
import { MaterialExportRequestService } from './material-export-request.service';
import { IsMaterialExportRequestExistValidator } from './validator/is-material-export-request-exist.validator';

@Module({
  imports: [
    PrismaModule,
    MaterialExportReceiptModule,
    TaskModule,
    DiscussionModule,
    ChatModule,
    ProductionBatchModule,
    NotificationModule,
  ],
  controllers: [MaterialExportRequestController],
  providers: [
    MaterialExportRequestService,
    IsMaterialExportRequestExistValidator,
  ],
  exports: [
    MaterialExportRequestService,
    IsMaterialExportRequestExistValidator,
  ],
})
export class MaterialExportRequestModule {}
