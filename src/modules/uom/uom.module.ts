import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UomController } from './uom.controller';
import { UomService } from './uom.service';
import { IsUomExistValidator } from './validation/is-uom-exist.validation';

@Module({
  controllers: [UomController],
  imports: [PrismaModule],
  providers: [UomService, IsUomExistValidator],
})
export class UomModule {}
