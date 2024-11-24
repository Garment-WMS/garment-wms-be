import { Module } from '@nestjs/common';
import { InspectionReportModule } from '../inspection-report/inspection-report.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { ProductReceiptModule } from '../product-receipt/product-receipt.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [DashboardController],
  imports: [
    PrismaModule,
    MaterialReceiptModule,
    ProductReceiptModule,
    InspectionReportModule,
  ],
  providers: [DashboardService],
})
export class DashboardModule {}
