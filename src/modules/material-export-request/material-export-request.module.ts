import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialExportReceiptModule } from '../material-export-receipt/material-export-receipt.module';
import { MaterialExportRequestController } from './material-export-request.controller';
import { MaterialExportRequestService } from './material-export-request.service';
import { IsMaterialExportRequestExistValidator } from './validator/is-material-export-request-exist.validator';

@Module({
  imports: [PrismaModule, MaterialExportReceiptModule],
  controllers: [MaterialExportRequestController],
  providers: [
    MaterialExportRequestService,
    IsMaterialExportRequestExistValidator,
  ],
  exports: [
    MaterialExportRequestService,
    IsMaterialExportRequestExistValidator,
  ],
})
export class MaterialExportRequestModule {}
