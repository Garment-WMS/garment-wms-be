import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ImportRequestController } from './import-request.controller';
import { ImportRequestService } from './import-request.service';
import { IsImportRequestExistPipe } from './pipe/is-import-request-exist.pipe';
import { IsImportReqStatusCanCreateInspectionReqValidator } from './validator/is-import-req-can-create-inspetion-req';
import { IsImportRequestExistValidator } from './validator/is-import-request-exist.validator';
import { IsPoDeliveryDoesNotHaveActiveImportRequestValidator } from './validator/is-po-delivery-has-active-import-request';

@Module({
  imports: [PrismaModule, PoDeliveryModule],
  controllers: [ImportRequestController],
  providers: [
    ImportRequestService,
    IsImportRequestExistPipe,
    IsImportRequestExistValidator,
    IsImportReqStatusCanCreateInspectionReqValidator,
    IsPoDeliveryDoesNotHaveActiveImportRequestValidator,
  ],
  exports: [
    ImportRequestService,
    IsImportRequestExistPipe,
    IsImportRequestExistValidator,
    IsImportReqStatusCanCreateInspectionReqValidator,
    IsPoDeliveryDoesNotHaveActiveImportRequestValidator,
  ],
})
export class ImportRequestModule {}
