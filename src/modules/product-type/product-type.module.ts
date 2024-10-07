import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { IsProductTypeExistValidator } from './validator/is-product-type-exist.validator';

@Module({
  controllers: [ProductTypeController],
  imports: [PrismaModule],
  providers: [ProductTypeService, IsProductTypeExistValidator],
})
export class ProductTypeModule {}
