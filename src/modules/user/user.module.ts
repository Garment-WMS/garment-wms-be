import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImageModule } from '../image/image.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [ImageModule, PrismaModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
