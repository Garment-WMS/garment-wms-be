import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductSizeController } from './product-size.controller';
import { ProductSizeService } from './product-size.service';
import { IsProductVariantExistValidator } from './validator/is-product-variant-exist.validator';

@Module({
  controllers: [ProductSizeController],
  imports: [PrismaModule],
  providers: [ProductSizeService, IsProductVariantExistValidator],
})
export class ProductVariantModule {}
