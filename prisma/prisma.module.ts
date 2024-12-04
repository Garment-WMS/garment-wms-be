import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
//Test