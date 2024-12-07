import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatModule } from '../chat/chat.module';
import { InventoryStockModule } from '../inventory-stock/inventory-stock.module';
import { IsMaterialExportRequestExistPipe } from '../material-export-request/validator/is-material-export-request-exist.pipe';
import { IsMaterialExportRequestExistValidator } from '../material-export-request/validator/is-material-export-request-exist.validator';
import { TaskModule } from '../task/task.module';
import { ExportAlgorithmService } from './export-algorithm.service';
import { MaterialExportReceiptController } from './material-export-receipt.controller';
import { MaterialExportReceiptService } from './material-export-receipt.service';

@Module({
  imports: [PrismaModule, TaskModule, ChatModule, InventoryStockModule],
  controllers: [MaterialExportReceiptController],
  providers: [
    MaterialExportReceiptService,
    ExportAlgorithmService,
    IsMaterialExportRequestExistValidator,
    IsMaterialExportRequestExistPipe,
  ],
  exports: [MaterialExportReceiptService, ExportAlgorithmService],
})
export class MaterialExportReceiptModule {}
