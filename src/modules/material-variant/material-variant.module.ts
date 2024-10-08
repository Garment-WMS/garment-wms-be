import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialVariantController } from './material-variant.controller';
import { MaterialVariantService } from './material-variant.service';
import { IsMaterialVariantExistValidator } from './validator/is-material-variant-exist.validator';

@Module({
  controllers: [MaterialVariantController],
  imports: [PrismaModule],
  providers: [MaterialVariantService, IsMaterialVariantExistValidator],
  exports: [MaterialVariantService],
})
export class MaterialVariantModule {}
