import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductUomController } from './product-uom.controller';
import { ProductUomService } from './product-uom.service';
import { IsProductUomExistValidator } from './validator/is-product-uom-exist.validator';

@Module({
  controllers: [ProductUomController],
  imports: [PrismaModule],
  providers: [ProductUomService, IsProductUomExistValidator],
})
export class ProductUomModule {}
