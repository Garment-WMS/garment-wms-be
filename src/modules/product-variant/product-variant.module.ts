import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { IsProductVariantExistValidator } from './validator/is-product-variant-exist.validator';

@Module({
  controllers: [ProductVariantController],
  imports: [PrismaModule],
  providers: [ProductVariantService, IsProductVariantExistValidator],
})
export class ProductVariantModule {}
