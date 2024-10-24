import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';

import { MaterialPackageController } from './material-package.controller';
import { MaterialPackageService } from './material-package.service';
import { IsMaterialVariantExistValidator } from './validator/is-material-variant-exist.validator';

@Module({
  controllers: [MaterialPackageController],
  imports: [PrismaModule],
  providers: [MaterialPackageService, IsMaterialVariantExistValidator],
  exports: [MaterialPackageService],
})
export class MaterialPackageModule {}
