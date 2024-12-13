import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from 'src/modules/user/user.module';
import { InventoryStockModule } from 'src/modules/inventory-stock/inventory-stock.module';
import { MaterialVariantModule } from 'src/modules/material-variant/material-variant.module';

@Module({
  controllers: [NotificationController],
  imports: [AuthModule, PrismaModule,UserModule,InventoryStockModule,MaterialVariantModule],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
