import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
  controllers: [ExcelController],
  imports: [PrismaModule],
  providers: [ExcelService],
})
export class ExcelModule {}
