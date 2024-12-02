import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductAttributeController } from './product-attribute.controller';
import { ProductAttributeService } from './product-attribute.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductAttributeController],
  providers: [ProductAttributeService],
  exports: [ProductAttributeService],
})
export class ProductAttributeModule {}
