import { Module } from '@nestjs/common';
import { MaterialVariantService } from './material-variant.service';
import { MaterialVariantController } from './material-variant.controller';

@Module({
  controllers: [MaterialVariantController],
  providers: [MaterialVariantService],
})
export class MaterialVariantModule {}
