import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImageModule } from '../image/image.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { IsProductExistValidator } from './validator/is-product-exist.validator';

@Module({
  controllers: [ProductController],
  imports: [PrismaModule, ImageModule],
  providers: [ProductService, IsProductExistValidator],
})
export class ProductModule {}
