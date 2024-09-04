import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [],
  providers: [PrismaService],
  exports: [],
})
export class OtpModule {}
