import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      delimiter: '.',
      newListener: false,
      removeListener: false,
      ignoreErrors: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      wildcard: false,
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
//Test
