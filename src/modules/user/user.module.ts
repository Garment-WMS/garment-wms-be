import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImageModule } from '../image/image.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IsUserRoleExistValidator } from './validator/is-user-of-role-exist.validator';

@Module({
  controllers: [UserController],
  imports: [PrismaModule, ImageModule],
  providers: [UserService,IsUserRoleExistValidator],
  exports: [UserService],
})
export class UserModule {}
