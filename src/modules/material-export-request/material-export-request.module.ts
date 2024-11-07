import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialExportRequestController } from './material-export-request.controller';
import { MaterialExportRequestService } from './material-export-request.service';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialExportRequestController],
  providers: [MaterialExportRequestService],
  exports: [MaterialExportRequestService],
})
export class MaterialExportRequestModule {}
