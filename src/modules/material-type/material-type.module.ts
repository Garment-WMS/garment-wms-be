import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialTypeController } from './material-type.controller';
import { MaterialTypeService } from './material-type.service';
import { IsMaterialTypeExistValidator } from './validator/is-material-type-exist.validator';

@Module({
  controllers: [MaterialTypeController],
  imports: [PrismaModule],
  providers: [MaterialTypeService, IsMaterialTypeExistValidator],
})
export class MaterialTypeModule {}
