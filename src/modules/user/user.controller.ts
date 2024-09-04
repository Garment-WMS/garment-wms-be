import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { GetUser } from '../../common/decorator/get_user.decorator';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
      const result = await this.userService.findOneByUserId(user.accountId);

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
