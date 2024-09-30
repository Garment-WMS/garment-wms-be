import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialTypeController } from './material-type.controller';
import { MaterialTypeService } from './material-type.service';

@Module({
  controllers: [MaterialTypeController],
  imports: [PrismaModule],
  providers: [MaterialTypeService],
})
export class MaterialTypeModule {}
