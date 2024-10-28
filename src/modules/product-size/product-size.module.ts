import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { ProductSizeController } from './product-size.controller';
import { ProductSizeService } from './product-size.service';
import { IsProductVariantExistValidator } from './validator/is-product-variant-exist.validator';

@Module({
  controllers: [ProductSizeController],
  imports: [PrismaModule, ProductVariantModule],
  providers: [ProductSizeService, IsProductVariantExistValidator],
  exports: [ProductSizeService],
})
export class ProductSizeModule {}
