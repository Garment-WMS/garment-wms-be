import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImageModule } from '../image/image.module';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { IsMaterialExistValidator } from './validation/is-material-exist.validation';

@Module({
  controllers: [MaterialController],
  imports: [PrismaModule, ImageModule],
  providers: [MaterialService, IsMaterialExistValidator],
  exports: [MaterialService],
})
export class MaterialModule {}
