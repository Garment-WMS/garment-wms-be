import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  imports: [PrismaModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
