import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { IsMaterialExportRequestExistValidator } from '../material-export-request/validator/is-material-export-request-exist.validator';
import { TaskModule } from '../task/task.module';
import { ExportAlgorithmService } from './export-algorithm.service';
import { MaterialExportReceiptController } from './material-export-receipt.controller';
import { MaterialExportReceiptService } from './material-export-receipt.service';

@Module({
  imports: [PrismaModule, TaskModule],
  controllers: [MaterialExportReceiptController],
  providers: [
    MaterialExportReceiptService,
    ExportAlgorithmService,
    IsMaterialExportRequestExistValidator,
  ],
  exports: [MaterialExportReceiptService, ExportAlgorithmService],
})
export class MaterialExportReceiptModule {}
