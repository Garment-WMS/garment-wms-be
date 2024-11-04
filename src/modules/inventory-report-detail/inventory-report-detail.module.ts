import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryReportDetailController } from './inventory-report-detail.controller';
import { InventoryReportDetailService } from './inventory-report-detail.service';

@Module({
  controllers: [InventoryReportDetailController],
  imports: [PrismaModule],
  providers: [InventoryReportDetailService],
  exports: [InventoryReportDetailService],
})
export class InventoryReportDetailModule {}
