import { Module } from '@nestjs/common';
import { ProductReceiptController } from './product-receipt.controller';
import { ProductReceiptService } from './product-receipt.service';

@Module({
  controllers: [ProductReceiptController],
  providers: [ProductReceiptService],
  exports: [ProductReceiptService],
})
export class ProductReceiptModule {}
