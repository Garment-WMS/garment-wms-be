import { Module } from '@nestjs/common';
import { MaterialUnitService } from './material-unit.service';
import { MaterialUnitController } from './material-unit.controller';

@Module({
  controllers: [MaterialUnitController],
  providers: [MaterialUnitService],
})
export class MaterialUnitModule {}
