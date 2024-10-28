import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImageModule } from '../image/image.module';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { IsProductExistValidator } from './validator/is-product-exist.validator';

@Module({
  controllers: [ProductVariantController],
  imports: [PrismaModule, ImageModule],
  providers: [ProductVariantService, IsProductExistValidator],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
