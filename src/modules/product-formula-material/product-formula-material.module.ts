import { Module } from '@nestjs/common';
import { ProductFormulaMaterialService } from './product-formula-material.service';
import { ProductFormulaMaterialController } from './product-formula-material.controller';

@Module({
  controllers: [ProductFormulaMaterialController],
  providers: [ProductFormulaMaterialService],
})
export class ProductFormulaMaterialModule {}
