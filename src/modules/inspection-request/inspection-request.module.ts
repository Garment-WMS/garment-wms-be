import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TaskModule } from '../task/task.module';
import { InspectionRequestController } from './inspection-request.controller';
import { InspectionRequestService } from './inspection-request.service';
import { IsInspectionRequestExistPipe } from './pipe/is-inspection-request-exist.pipe';
import { IsInspectionRequestExistValidator } from './validator/is-inspection-request-exist.validator';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [PrismaModule, TaskModule,ChatModule],
  controllers: [InspectionRequestController],
  providers: [
    InspectionRequestService,
    IsInspectionRequestExistValidator,
    IsInspectionRequestExistPipe,
  ],
  exports: [
    InspectionRequestService,
    IsInspectionRequestExistValidator,
    IsInspectionRequestExistPipe,
  ],
})
export class InspectionRequestModule {}
