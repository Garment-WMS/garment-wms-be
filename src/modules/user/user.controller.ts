import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { GetUser } from '../../common/decorator/get_user.decorator';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('account')
@ApiTags('Account')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getAccountById(@Param('id') id: string) {
    return this.userService.getAccountById(id);
  }
  @Get('role/:role')
  getAllUserByRole(@Param('role') role: RoleCode) {
    return this.userService.getAllUserByRole(role);
  }
  @Get(':role/:id')
  getUserById(@Param('id') id: string, @Param('role') role: RoleCode) {
    return this.userService.getUserById(id, role);
  }
  @Post('/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: AuthenUser,
  ) {
    return this.userService.addAvatar(file, user);
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@GetUser() user: AuthenUser) {
    try {
      const result = await this.userService.findOneByUserId(user.userId);

      if (result) {
        return apiSuccess(200, result, 'Get user success');
      } else {
        return apiFailed(404, null, 'User not found');
      }
    } catch (e) {
      if (e.code === 'P2025') {
        return apiFailed(404, 'User not found');
      }
      return apiFailed(500, e, 'Internal server error');
    }
  }

  @Get('/by-username')
  async findOneByUserName(@Body() body: { username: string }) {
    try {
      const result = await this.userService.findOneByUserName(body.username);

      if (result) {
        return apiSuccess(200, result, 'Get user by username success');
      } else {
        return apiFailed(404, null, 'User not found');
      }
    } catch (e) {
      if (e.code === 'P2025') {
        return apiFailed(404, 'User not found', '[username]');
      }
      return apiFailed(500, e, 'Internal server error');
    }
  }
}
