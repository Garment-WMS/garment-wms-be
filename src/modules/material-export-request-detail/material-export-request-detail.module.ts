import { Module } from '@nestjs/common';
import { MaterialExportRequestDetailService } from './material-export-request-detail.service';
import { MaterialExportRequestDetailController } from './material-export-request-detail.controller';

@Module({
  controllers: [MaterialExportRequestDetailController],
  providers: [MaterialExportRequestDetailService],
})
export class MaterialExportRequestDetailModule {}
