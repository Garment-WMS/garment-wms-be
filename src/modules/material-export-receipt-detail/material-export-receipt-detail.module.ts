import { Module } from '@nestjs/common';
import { MaterialExportReceiptDetailService } from './material-export-receipt-detail.service';
import { MaterialExportReceiptDetailController } from './material-export-receipt-detail.controller';

@Module({
  controllers: [MaterialExportReceiptDetailController],
  providers: [MaterialExportReceiptDetailService],
})
export class MaterialExportReceiptDetailModule {}
