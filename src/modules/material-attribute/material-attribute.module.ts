import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialAttributeController } from './material-attribute.controller';
import { MaterialAttributeService } from './material-attribute.service';

@Module({
  controllers: [MaterialAttributeController],
  imports: [PrismaModule],
  providers: [MaterialAttributeService],
  exports: [MaterialAttributeService],
})
export class MaterialAttributeModule {}
