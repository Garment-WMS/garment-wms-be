import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  controllers: [SupplierController],
  imports: [PrismaModule],
  providers: [SupplierService],
})
export class SupplierModule {}
