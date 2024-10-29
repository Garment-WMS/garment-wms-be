import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { ProductSizeController } from './product-size.controller';
import { ProductSizeService } from './product-size.service';
import { IsProductSizeExistValidator } from './validator/is-product-size-exist.validator';

@Module({
  controllers: [ProductSizeController],
  imports: [PrismaModule, ProductVariantModule],
  providers: [ProductSizeService, IsProductSizeExistValidator],
  exports: [ProductSizeService],
})
export class ProductSizeModule {}
