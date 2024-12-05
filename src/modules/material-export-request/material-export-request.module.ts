import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { DiscussionModule } from '../discussion/discussion.module';
import { MaterialExportReceiptModule } from '../material-export-receipt/material-export-receipt.module';
import { TaskModule } from '../task/task.module';
import { MaterialExportRequestController } from './material-export-request.controller';
import { MaterialExportRequestService } from './material-export-request.service';
import { IsMaterialExportRequestExistValidator } from './validator/is-material-export-request-exist.validator';
import { ChatModule } from '../chat/chat.module';
import { ProductionBatchModule } from '../production-batch/production-batch.module';

@Module({
  imports: [
    PrismaModule,
    MaterialExportReceiptModule,
    TaskModule,
    DiscussionModule,
    ChatModule,
    ProductionBatchModule,
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
