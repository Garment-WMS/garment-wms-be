import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { MaterialPackageModule } from '../material-package/material-package.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
  controllers: [ExcelController],
  imports: [
    PrismaModule,
    FirebaseModule,
    MaterialVariantModule,
    MaterialPackageModule,
  ],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
