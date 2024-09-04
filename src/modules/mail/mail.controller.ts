import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MailService } from './mail.service';
import e from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/response.dto';
import { apiSuccess } from 'src/common/dto/api-response';

@Controller('mail')
@ApiTags('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  async test(@Query('email') email: string) {
    Logger.log('Send email to ' + email);
    await this.mailService.sendOTP(email, '123456');
    return apiSuccess(200, null, 'Send email successfully');
  }
}
