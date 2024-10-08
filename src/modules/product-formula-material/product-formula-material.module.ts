import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialModule } from '../material/material.module';
import { ProductFormulaMaterialController } from './product-formula-material.controller';
import { ProductFormulaMaterialService } from './product-formula-material.service';

@Module({
  controllers: [ProductFormulaMaterialController],
  imports: [MaterialModule, PrismaModule],
  providers: [ProductFormulaMaterialService],
  exports: [ProductFormulaMaterialService],
})
export class ProductFormulaMaterialModule {}
