import { Module } from '@nestjs/common';
import { ProductionBatchMaterialVariantService } from './production-batch-material-variant.service';
import { ProductionBatchMaterialVariantController } from './production-batch-material-variant.controller';

@Module({
  controllers: [ProductionBatchMaterialVariantController],
  providers: [ProductionBatchMaterialVariantService],
})
export class ProductionBatchMaterialVariantModule {}
