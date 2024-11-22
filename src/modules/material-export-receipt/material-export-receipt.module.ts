import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialExportReceiptController } from './material-export-receipt.controller';
import { MaterialExportReceiptService } from './material-export-receipt.service';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialExportReceiptController],
  providers: [MaterialExportReceiptService],
  exports: [MaterialExportReceiptService],
})
export class MaterialExportReceiptModule {}
