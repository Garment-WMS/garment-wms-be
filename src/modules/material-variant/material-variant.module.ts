import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImageModule } from '../image/image.module';
import { MaterialAttributeModule } from '../material-attribute/material-attribute.module';
import { MaterialPackageModule } from '../material-package/material-package.module';
import { MaterialVariantController } from './material-variant.controller';
import { MaterialVariantService } from './material-variant.service';
import { IsMaterialVariantExistValidator } from './validation/is-material-exist.validation';

@Module({
  controllers: [MaterialVariantController],
  imports: [
    PrismaModule,
    ImageModule,
    MaterialPackageModule,
    MaterialAttributeModule,
  ],
  providers: [MaterialVariantService, IsMaterialVariantExistValidator],
  exports: [MaterialVariantService],
})
export class MaterialVariantModule {}
