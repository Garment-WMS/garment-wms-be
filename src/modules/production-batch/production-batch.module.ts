import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ExcelModule } from '../excel/excel.module';
import { ProductPlanDetailModule } from '../product-plan-detail/product-plan-detail.module';
import { IsProductionBatchExistPipe } from './pipe/is-production-batch-exist.pipe';
import { ProductionBatchController } from './production-batch.controller';
import { ProductionBatchService } from './production-batch.service';
import { IsProductionBatchExistValidator } from './validator/is-production-batch-exist.validator';

@Module({
  imports: [PrismaModule, ExcelModule, ProductPlanDetailModule],
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
