import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendOTP(email: string): Promise<ApiResponse> {
    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + Constant.OTP_EXPIRE_MINUTES);
    const otpRecord = await this.prismaService.otp.create({
      data: {
        email,
        otp,
        expiredAt,
      },
    });
    const isSent = await this.mailService.sendOTP(email, otp);
    if (!isSent)
      return apiFailed(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to send OTP');
    return apiSuccess(HttpStatus.OK, true, 'OTP sent successfully');
  }

  async verifyOTP(email: string, otp: string): Promise<ApiResponse> {
    const otpRecord = await this.prismaService.otp.findFirst({
      where: {
        email,
        otp,
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    const now = new Date();
    if (otpRecord.expiredAt < now) {
      return apiFailed(HttpStatus.BAD_REQUEST, 'OTP expired');
    }
    return apiSuccess(HttpStatus.OK, true, 'OTP verified successfully');
  }
}
