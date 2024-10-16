import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InspectionReportModule } from '../inspection-report/inspection-report.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ImportReceiptController } from './import-receipt.controller';
import { ImportReceiptService } from './import-receipt.service';

@Module({
  controllers: [ImportReceiptController],
  imports: [
    MaterialReceiptModule,
    PrismaModule,
    InspectionReportModule,
    PoDeliveryModule,
  ],
  providers: [ImportReceiptService],
})
export class ImportReceiptModule {}
