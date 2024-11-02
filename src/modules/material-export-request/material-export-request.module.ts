import { Module } from '@nestjs/common';
import { MaterialExportRequestService } from './material-export-request.service';
import { MaterialExportRequestController } from './material-export-request.controller';

@Module({
  controllers: [MaterialExportRequestController],
  providers: [MaterialExportRequestService],
})
export class MaterialExportRequestModule {}
