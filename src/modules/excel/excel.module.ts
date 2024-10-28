import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { MaterialPackageModule } from '../material-package/material-package.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductSizeModule } from '../product-size/product-size.module';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
  controllers: [ExcelController],
  imports: [
    PrismaModule,
    FirebaseModule,
    MaterialVariantModule,
    MaterialPackageModule,
    ProductSizeModule,
  ],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
