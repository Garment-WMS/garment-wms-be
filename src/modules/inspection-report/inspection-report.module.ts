import { Module } from '@nestjs/common';
import { InspectionReportService } from './inspection-report.service';
import { InspectionReportController } from './inspection-report.controller';

@Module({
  controllers: [InspectionReportController],
  providers: [InspectionReportService],
})
export class InspectionReportModule {}
