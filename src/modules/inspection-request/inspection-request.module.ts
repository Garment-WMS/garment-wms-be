import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InspectionRequestController } from './inspection-request.controller';
import { InspectionRequestService } from './inspection-request.service';

@Module({
  imports: [PrismaModule],
  controllers: [InspectionRequestController],
  providers: [InspectionRequestService],
  exports: [InspectionRequestService],
})
export class InspectionRequestModule {}
