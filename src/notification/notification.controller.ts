import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { apiSuccess } from 'src/common/dto/api-response';
import { AuthenUser } from 'src/modules/auth/dto/authen-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/strategy/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  async findAll() {
    return apiSuccess(
      200,
      await this.notificationService.findAll(),
      'get notifications successfully',
    );
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async findMyNotifications(@GetUser() user: AuthenUser) {
    return apiSuccess(
      200,
      await this.notificationService.findByUserId(user.userId),
      'get my notifications successfully',
    );
  }

  @Get(':id')
  async findUniqueAndUpdateRead(@Param('id', ParseUUIDPipe) id: string) {
    return apiSuccess(
      200,
      await this.notificationService.findUniqueAndUpdateRead(id),
      'get notification successfully',
    );
  }

  @Post()
  test() {
    return this.notificationService.test();
  }
}
