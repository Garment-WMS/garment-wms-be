import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialVariantController } from './material-variant.controller';
import { MaterialVariantService } from './material-variant.service';

@Module({
  controllers: [MaterialVariantController],
  imports: [PrismaModule],
  providers: [MaterialVariantService],
  exports: [MaterialVariantService],
})
export class MaterialVariantModule {}
