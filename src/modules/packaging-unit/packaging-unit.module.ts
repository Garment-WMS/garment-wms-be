import { Module } from '@nestjs/common';
import { PackagingUnitService } from './packaging-unit.service';
import { PackagingUnitController } from './packaging-unit.controller';

@Module({
  controllers: [PackagingUnitController],
  providers: [PackagingUnitService],
})
export class PackagingUnitModule {}
