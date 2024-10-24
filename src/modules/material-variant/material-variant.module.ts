import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImageModule } from '../image/image.module';
import { MaterialVariantController } from './material-variant.controller';
import { MaterialVariantService } from './material-variant.service';
import { IsMaterialExistValidator } from './validation/is-material-exist.validation';

@Module({
  controllers: [MaterialVariantController],
  imports: [PrismaModule, ImageModule],
  providers: [MaterialVariantService, IsMaterialExistValidator],
  exports: [MaterialVariantService],
})
export class MaterialVariantModule {}
