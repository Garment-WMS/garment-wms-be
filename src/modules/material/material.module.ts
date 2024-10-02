import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { IsMaterialExistValidator } from './validation/is-material-exist.validation';

@Module({
  controllers: [MaterialController],
  imports: [PrismaModule],
  providers: [MaterialService, IsMaterialExistValidator],
  exports: [MaterialService],
})
export class MaterialModule {}
