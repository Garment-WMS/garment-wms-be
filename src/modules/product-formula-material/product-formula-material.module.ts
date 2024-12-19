import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductFormulaMaterialController } from './product-formula-material.controller';
import { ProductFormulaMaterialService } from './product-formula-material.service';

@Module({
  controllers: [ProductFormulaMaterialController],
  imports: [MaterialVariantModule, PrismaModule],
  providers: [ProductFormulaMaterialService],
  exports: [ProductFormulaMaterialService],
})
export class ProductFormulaMaterialModule {}
