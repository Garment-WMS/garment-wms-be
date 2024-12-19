import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';

import { MaterialPackageController } from './material-package.controller';
import { MaterialPackageService } from './material-package.service';
import { IsMaterialPackageExistValidator } from './validator/is-material-package-exist.validator';

@Module({
  controllers: [MaterialPackageController],
  imports: [PrismaModule],
  providers: [MaterialPackageService, IsMaterialPackageExistValidator],
  exports: [MaterialPackageService],
})
export class MaterialPackageModule {}
