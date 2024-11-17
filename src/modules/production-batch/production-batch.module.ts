import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { IsProductionBatchExistPipe } from './pipe/is-production-batch-exist.pipe';
import { ProductionBatchController } from './production-batch.controller';
import { ProductionBatchService } from './production-batch.service';
import { IsProductionBatchExistValidator } from './validator/is-production-batch-exist.validator';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [PrismaModule,ExcelModule],
  controllers: [ProductionBatchController],
  providers: [
    ProductionBatchService,
    IsProductionBatchExistPipe,
    IsProductionBatchExistValidator,
  ],
  exports: [
    ProductionBatchService,
    IsProductionBatchExistPipe,
    IsProductionBatchExistValidator,
  ],
})
export class ProductionBatchModule {}
