import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ImportRequestModule } from 'src/modules/import-request/import-request.module';
import { InventoryStockModule } from 'src/modules/inventory-stock/inventory-stock.module';
import { MaterialVariantModule } from 'src/modules/material-variant/material-variant.module';
import { UserModule } from 'src/modules/user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Module({
  controllers: [NotificationController],
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    InventoryStockModule,
    MaterialVariantModule,
    // ImportRequestModule,
  ],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
