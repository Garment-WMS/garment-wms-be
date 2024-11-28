import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImportRequestModule } from '../import-request/import-request.module';
import { InventoryStockModule } from '../inventory-stock/inventory-stock.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { PoDeliveryMaterialModule } from '../po-delivery-material/po-delivery-material.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ProductReceiptModule } from '../product-receipt/product-receipt.module';
import { ProductionBatchModule } from '../production-batch/production-batch.module';
import { TaskModule } from '../task/task.module';
import { ImportReceiptController } from './import-receipt.controller';
import { ImportReceiptService } from './import-receipt.service';
import { InspectionReportModule } from '../inspection-report/inspection-report.module';
import { DiscussionModule } from '../discussion/discussion.module';

@Module({
  controllers: [ImportReceiptController],
  imports: [
    MaterialReceiptModule,
    ProductReceiptModule,
    PrismaModule,
    ProductionBatchModule,
    PoDeliveryModule,
    PoDeliveryMaterialModule,
    InventoryStockModule,
    ImportRequestModule,
    TaskModule,
    DiscussionModule,
  ],
  providers: [ImportReceiptService],
  exports: [ImportReceiptService],
})
export class ImportReceiptModule {}
