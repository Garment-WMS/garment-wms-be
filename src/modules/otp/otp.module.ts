import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule, PrismaModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OtpModule {}
