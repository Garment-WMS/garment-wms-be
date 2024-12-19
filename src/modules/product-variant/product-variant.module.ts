import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductAttributeModule } from 'src/product-attribute/product-attribute.module';
import { ImageModule } from '../image/image.module';
import { ProductSizeModule } from '../product-size/product-size.module';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { IsProductExistValidator } from './validator/is-product-exist.validator';

@Module({
  controllers: [ProductVariantController],
  imports: [
    PrismaModule,
    ImageModule,
    ProductAttributeModule,
    ProductSizeModule,
  ],
  providers: [ProductVariantService, IsProductExistValidator],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
