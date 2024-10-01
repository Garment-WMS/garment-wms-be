import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PackagingUnitController } from './packaging-unit.controller';
import { PackagingUnitService } from './packaging-unit.service';

@Module({
  controllers: [PackagingUnitController],
  imports: [PrismaModule],
  providers: [PackagingUnitService],
})
export class PackagingUnitModule {}
