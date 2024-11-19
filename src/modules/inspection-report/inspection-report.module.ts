import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TaskModule } from '../task/task.module';
import { InspectionReportController } from './inspection-report.controller';
import { InspectionReportService } from './inspection-report.service';
import { IsInspectionReportExistPipe } from './pipe/is-inspection-report-exist.pipe';
import { IsInspectionReportExistValidator } from './validator/is-inspection-report-exist.validator';
import { IsInspectionReportDetailInImportRequestDetail } from './validator/is-inspection-report-material-variant-in-import-request';

@Module({
  imports: [PrismaModule, TaskModule],
  controllers: [InspectionReportController],
  providers: [
    InspectionReportService,
    IsInspectionReportExistPipe,
    IsInspectionReportExistValidator,
    IsInspectionReportDetailInImportRequestDetail,
  ],
  exports: [
    InspectionReportService,
    IsInspectionReportExistPipe,
    IsInspectionReportExistValidator,
    IsInspectionReportDetailInImportRequestDetail,
  ],
})
export class InspectionReportModule {}
