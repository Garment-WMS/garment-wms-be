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

import { ExcelModule } from './modules/excel/excel.module';
import { PurchaseOrderModule } from './modules/purchase_order/purchase_order.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, rolesGuard.RolesGuard],
  exports: [],
})
export class AppModule {}
