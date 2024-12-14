import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialExportRequestDetailController } from './material-export-request-detail.controller';
import { MaterialExportRequestDetailService } from './material-export-request-detail.service';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialExportRequestDetailController],
  providers: [MaterialExportRequestDetailService],
})
export class MaterialExportRequestDetailModule {}
