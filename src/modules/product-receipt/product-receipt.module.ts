import { Module } from '@nestjs/common';
import { ProductReceiptController } from './product-receipt.controller';
import { ProductReceiptService } from './product-receipt.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [ProductReceiptController],
  providers: [ProductReceiptService],
  imports: [PrismaModule],
  exports: [ProductReceiptService],
})
export class ProductReceiptModule {}
