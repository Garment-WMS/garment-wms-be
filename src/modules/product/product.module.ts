import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { IsProductTypeExistValidator } from './validator/is-product-type-exist.validator';

@Module({
  controllers: [ProductController],
  imports: [PrismaModule],
  providers: [ProductService, IsProductTypeExistValidator],
})
export class ProductTypeModule {}
