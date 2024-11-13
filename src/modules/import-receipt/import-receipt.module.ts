import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImportRequestModule } from '../import-request/import-request.module';
import { InspectionReportModule } from '../inspection-report/inspection-report.module';
import { InventoryStockModule } from '../inventory-stock/inventory-stock.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ImportReceiptController } from './import-receipt.controller';
import { ImportReceiptService } from './import-receipt.service';
import { PoDeliveryMaterialModule } from '../po-delivery-material/po-delivery-material.module';

@Module({
  controllers: [ImportReceiptController],
  imports: [
    MaterialReceiptModule,
    PrismaModule,
    InspectionReportModule,
    PoDeliveryModule,
    PoDeliveryMaterialModule,
    InventoryStockModule,
    ImportRequestModule,
  ],
  providers: [ImportReceiptService],
})
export class ImportReceiptModule {}
