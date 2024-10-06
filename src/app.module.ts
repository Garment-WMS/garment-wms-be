import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as rolesGuard from './common/guard/roles.guard';
import { AuthModule } from './modules/auth/auth.module';
import { BlacklistTokenModule } from './modules/blacklist-token/blacklist-token.module';
import { ImageModule } from './modules/image/image.module';
import { MailModule } from './modules/mail/mail.module';
import { OtpModule } from './modules/otp/otp.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
// import { RoleModule } from './modules/role/role.module';

import { PrismaModule } from 'prisma/prisma.module';
import { ExcelModule } from './modules/excel/excel.module';
import { MaterialModule } from './modules/material/material.module';

import { ImportRequestModule } from './modules/import-request/import-request.module';
import { MaterialAttributeModule } from './modules/material-attribute/material-attribute.module';
import { MaterialTypeModule } from './modules/material-type/material-type.module';
import { MaterialUnitModule } from './modules/material-unit/material-unit.module';
import { MaterialVariantModule } from './modules/material-variant/material-variant.module';
import { PoDeliveryMaterialModule } from './modules/po-delivery-material/po-delivery-material.module';
import { PoDeliveryModule } from './modules/po-delivery/po-delivery.module';
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { UomModule } from './modules/uom/uom.module';
import { UserModule } from './modules/user/user.module';
import { PoPoDeliveryBridgeModule } from './modules/po-po-delivery-bridge/po-po-delivery-bridge.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    BlacklistTokenModule,
    RefreshTokenModule,
    MailModule,
    ImageModule,
    OtpModule,
    ExcelModule,
    PurchaseOrderModule,
    SupplierModule,
    PoDeliveryModule,
    PoDeliveryMaterialModule,
    MaterialModule,
    MaterialTypeModule,
    // PackagingUnitModule,
    UomModule,
    MaterialUnitModule,
    MaterialAttributeModule,
    ImportRequestModule,
    MaterialVariantModule,
    PoPoDeliveryBridgeModule,
  ],
  controllers: [AppController],
  providers: [AppService, rolesGuard.RolesGuard],
  exports: [],
})
export class AppModule {}
