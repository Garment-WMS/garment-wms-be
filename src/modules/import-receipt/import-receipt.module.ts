import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatModule } from '../chat/chat.module';
import { DiscussionModule } from '../discussion/discussion.module';
import { ImportRequestModule } from '../import-request/import-request.module';
import { InventoryStockModule } from '../inventory-stock/inventory-stock.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { PoDeliveryMaterialModule } from '../po-delivery-material/po-delivery-material.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ProductReceiptModule } from '../product-receipt/product-receipt.module';
import { ProductionBatchModule } from '../production-batch/production-batch.module';
import { TaskModule } from '../task/task.module';
import { ImportReceiptController } from './import-receipt.controller';
import { ImportReceiptProcessor } from './import-receipt.processor';
import { ImportReceiptService } from './import-receipt.service';

@Module({
  controllers: [ImportReceiptController],
  imports: [
    MaterialReceiptModule,
    ProductReceiptModule,
    PrismaModule,
    ProductionBatchModule,
    PoDeliveryModule,
    PoDeliveryMaterialModule,
    InventoryStockModule,
    ImportRequestModule,
    TaskModule,
    DiscussionModule,
    BullModule.registerQueue({ name: 'import-receipt' }),
    
    ChatModule,
  ],
  providers: [ImportReceiptService, ImportReceiptProcessor],
  exports: [ImportReceiptService],
})
export class ImportReceiptModule {}
