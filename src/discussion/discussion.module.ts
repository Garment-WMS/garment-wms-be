import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { DiscussionController } from './discussion.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [DiscussionController],
  imports: [PrismaModule],
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}
