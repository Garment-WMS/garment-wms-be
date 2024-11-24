import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImportReceiptModule } from '../import-receipt/import-receipt.module';
import { ImportRequestModule } from '../import-request/import-request.module';
import { TaskModule } from '../task/task.module';
import { InspectionReportController } from './inspection-report.controller';
import { InspectionReportService } from './inspection-report.service';
import { IsInspectionReportExistPipe } from './pipe/is-inspection-report-exist.pipe';
import { IsInspectionReportExistValidator } from './validator/is-inspection-report-exist.validator';
import { IsInspectionReportDetailInImportRequestDetail } from './validator/is-inspection-report-material-variant-in-import-request';

@Module({
  imports: [PrismaModule, TaskModule, ImportReceiptModule],
  controllers: [InspectionReportController],
  providers: [
    InspectionReportService,
    IsInspectionReportExistPipe,
    IsInspectionReportExistValidator,
    IsInspectionReportDetailInImportRequestDetail,
    ImportRequestModule,
  ],
  exports: [
    InspectionReportService,
    IsInspectionReportExistPipe,
    IsInspectionReportExistValidator,
    IsInspectionReportDetailInImportRequestDetail,
  ],
})
export class InspectionReportModule {}
