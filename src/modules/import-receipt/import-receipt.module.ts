import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImportRequestModule } from '../import-request/import-request.module';
import { InspectionReportModule } from '../inspection-report/inspection-report.module';
import { InventoryStockModule } from '../inventory-stock/inventory-stock.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { PoDeliveryMaterialModule } from '../po-delivery-material/po-delivery-material.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ProductReceiptModule } from '../product-receipt/product-receipt.module';
import { TaskModule } from '../task/task.module';
import { ImportReceiptController } from './import-receipt.controller';
import { ImportReceiptService } from './import-receipt.service';
import { ProductionBatchModule } from '../production-batch/production-batch.module';

@Module({
  controllers: [ImportReceiptController],
  imports: [
    MaterialReceiptModule,
    ProductReceiptModule,
    PrismaModule,
    ProductionBatchModule,
    InspectionReportModule,
    PoDeliveryModule,
    PoDeliveryMaterialModule,
    InventoryStockModule,
    ImportRequestModule,
    TaskModule,
  ],
  providers: [ImportReceiptService],
})
export class ImportReceiptModule {}
