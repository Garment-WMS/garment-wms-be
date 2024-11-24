import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { DefectController } from './defect.controller';
import { DefectService } from './defect.service';

@Module({
  imports: [PrismaModule],
  controllers: [DefectController],
  providers: [DefectService],
  exports: [DefectService],
})
export class DefectModule {}
