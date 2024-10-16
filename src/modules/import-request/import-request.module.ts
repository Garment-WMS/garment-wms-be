import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ImportRequestController } from './import-request.controller';
import { ImportRequestService } from './import-request.service';
import { IsImportRequestExistPipe } from './pipe/is-import-request-exist.pipe';
import { IsImportRequestExistValidator } from './validator/is-import-request-exist.validator';

@Module({
  imports: [PrismaModule, PoDeliveryModule],
  controllers: [ImportRequestController],
  providers: [
    ImportRequestService,
    IsImportRequestExistPipe,
    IsImportRequestExistValidator,
  ],
  exports: [
    ImportRequestService,
    IsImportRequestExistPipe,
    IsImportRequestExistValidator,
  ],
})
export class ImportRequestModule {}
