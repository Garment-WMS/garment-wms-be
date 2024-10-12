import { Module } from '@nestjs/common';
import { ImportReceiptService } from './import-receipt.service';
import { ImportReceiptController } from './import-receipt.controller';

@Module({
  controllers: [ImportReceiptController],
  providers: [ImportReceiptService],
})
export class ImportReceiptModule {}
