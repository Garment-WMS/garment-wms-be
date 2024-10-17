import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { WarehouseStaffController } from './warehouse-staff.controller';
import { WarehouseStaffService } from './warehouse-staff.service';

@Module({
  imports: [PrismaModule],
  controllers: [WarehouseStaffController],
  providers: [WarehouseStaffService],
  exports: [WarehouseStaffService],
})
export class WarehouseStaffModule {}
