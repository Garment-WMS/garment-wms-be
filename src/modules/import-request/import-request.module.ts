import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImportRequestController } from './import-request.controller';
import { ImportRequestService } from './import-request.service';

@Module({
  imports: [PrismaModule],
  controllers: [ImportRequestController],
  providers: [ImportRequestService],
  exports: [ImportRequestService],
})
export class ImportRequestModule {}
