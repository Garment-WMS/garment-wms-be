import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ImageModule } from '../image/image.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [ImageModule],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
