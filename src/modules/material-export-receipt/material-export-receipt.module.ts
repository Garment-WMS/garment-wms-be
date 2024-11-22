import { Module } from '@nestjs/common';
import { MaterialExportReceiptService } from './material-export-receipt.service';
import { MaterialExportReceiptController } from './material-export-receipt.controller';

@Module({
  controllers: [MaterialExportReceiptController],
  providers: [MaterialExportReceiptService],
})
export class MaterialExportReceiptModule {}
