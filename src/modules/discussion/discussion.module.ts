import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { NotificationModule } from 'src/notification/notification.module';
import { DiscussionController } from './discussion.controller';
import { DiscussionService } from './discussion.service';

@Module({
  controllers: [DiscussionController],
  imports: [PrismaModule, NotificationModule],
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}
