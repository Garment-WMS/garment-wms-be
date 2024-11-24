import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductionBatchMaterialVariantController } from './production-batch-material-variant.controller';
import { ProductionBatchMaterialVariantService } from './production-batch-material-variant.service';

@Module({
  controllers: [ProductionBatchMaterialVariantController],
  imports: [PrismaModule],
  providers: [ProductionBatchMaterialVariantService],
  exports: [ProductionBatchMaterialVariantService],
})
export class ProductionBatchMaterialVariantModule {}
