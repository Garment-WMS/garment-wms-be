import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { MaterialModule } from '../material/material.module';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
  controllers: [ExcelController],
  imports: [
    PrismaModule,
    FirebaseModule,
    MaterialModule,
    MaterialVariantModule,
  ],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
