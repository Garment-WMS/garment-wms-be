import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InspectionDepartmentController } from './inspection-department.controller';
import { InspectionDepartmentService } from './inspection-department.service';

@Module({
  imports: [PrismaModule],
  controllers: [InspectionDepartmentController],
  providers: [InspectionDepartmentService],
  exports: [InspectionDepartmentService],
})
export class InspectionDepartmentModule {}
