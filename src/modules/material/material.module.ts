import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { IsMaterialTypeExistValidator } from './validator/is-material-type-exist.validator';

@Module({
  controllers: [MaterialController],
  imports: [PrismaModule],
  providers: [MaterialService, IsMaterialTypeExistValidator],
})
export class MaterialModule {}
