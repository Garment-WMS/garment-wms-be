import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { DiscussionModule } from '../discussion/discussion.module';
import { ImportReceiptModule } from '../import-receipt/import-receipt.module';
import { InspectionRequestModule } from '../inspection-request/inspection-request.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ProductReceiptModule } from '../product-receipt/product-receipt.module';
import { ProductionBatchModule } from '../production-batch/production-batch.module';
import { TaskModule } from '../task/task.module';
import { ImportRequestController } from './import-request.controller';
import { ImportRequestService } from './import-request.service';
import { IsImportRequestExistPipe } from './pipe/is-import-request-exist.pipe';
import { IsImportReqStatusCanCreateInspectionReqValidator } from './validator/is-import-req-can-create-inspetion-req';
import { IsImportRequestExistValidator } from './validator/is-import-request-exist.validator';
import { IsPoDeliveryDoesNotHaveActiveImportRequestValidator } from './validator/is-po-delivery-has-active-import-request';

@Module({
  imports: [
    DiscussionModule,
    PrismaModule,
    PoDeliveryModule,
    InspectionRequestModule,
    ProductReceiptModule,
    MaterialReceiptModule,
    ProductionBatchModule,
    TaskModule,
  ],
  controllers: [ImportRequestController],
  providers: [
    ImportRequestService,
    IsImportRequestExistPipe,
    IsImportRequestExistValidator,
    IsImportReqStatusCanCreateInspectionReqValidator,
    IsPoDeliveryDoesNotHaveActiveImportRequestValidator,
  ],
  exports: [
    ImportRequestService,
    IsImportRequestExistPipe,
    IsImportRequestExistValidator,
    IsImportReqStatusCanCreateInspectionReqValidator,
    IsPoDeliveryDoesNotHaveActiveImportRequestValidator,
  ],
})
export class ImportRequestModule {}
