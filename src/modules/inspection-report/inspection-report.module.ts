import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InspectionReportController } from './inspection-report.controller';
import { InspectionReportService } from './inspection-report.service';
import { IsInspectionReportExistPipe } from './pipe/is-inspection-report-exist.pipe';
import { IsInspectionReportExistValidator } from './validator/is-inspection-report-exist.validator';

@Module({
  imports: [PrismaModule],
  controllers: [InspectionReportController],
  providers: [
    InspectionReportService,
    IsInspectionReportExistPipe,
    IsInspectionReportExistValidator,
  ],
  exports: [
    InspectionReportService,
    IsInspectionReportExistPipe,
    IsInspectionReportExistValidator,
  ],
})
export class InspectionReportModule {}
