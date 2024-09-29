import { Module } from '@nestjs/common';
import { ImportRequestDetailService } from './import-request-detail.service';
import { ImportRequestDetailController } from './import-request-detail.controller';

@Module({
  controllers: [ImportRequestDetailController],
  providers: [ImportRequestDetailService],
})
export class ImportRequestDetailModule {}
