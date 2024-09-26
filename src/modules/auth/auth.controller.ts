import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { GetUser } from '../../common/decorator/get_user.decorator';
import { AuthService } from './auth.service';
import { AuthenUser } from './dto/authen-user.dto';
import { EmailDTO } from './dto/email.dto';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { Logout } from './dto/logout.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { SendResetPasswordDTO } from './dto/send-reset-password.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { VerifyOtpDTO } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './strategy/refresh-jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Test auth
  @Get('/test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    // RoleCode.LANDLORD,
    RoleCode.TECHNICAL_STAFF,
    RoleCode.STAFF,
    RoleCode.MANAGER,
  )
  testAuth(@GetUser() user) {
    return user;
  }

  //SIGN IN FLOW
  @Post('/renter/login')
  @UsePipes(new ValidationPipe())
  renterLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.RENTER);
  }

  @Post('/manager/login')
  managerLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.MANAGER);
  }

  @Post('/staff/login')
  staffLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.STAFF);
  }

  @Post('/technical-staff/login')
  technicalStaffLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.TECHNICAL_STAFF);
  }

  @Post('/admin/login')
  adminLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.ADMIN);
  }

  @Post('/landlord/login')
  landlordLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.LANDLORD);
  }

  //SIGN UP FLOW
  @Post('/sign-up/renter')
  renterSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.RENTER);
  }

  @Post('/sign-up/landlord')
  landlordSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.LANDLORD);
  }

  //To-do: Need Authen Manager to do this
  @Post('/sign-up/staff')
  staffSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.STAFF);
  }

  //To-do: Need Authen Manager to do this
  @Post('/sign-up/technical-staff')
  technicalStaffSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.TECHNICAL_STAFF);
  }

  //To-do: Need Authen Manager to do this
  @Post('/sign-up/manager')
  managerSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.MANAGER);
  }

  @Get('/refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  refreshToken(@GetUser() user: AuthenUser) {
    return this.authService.refreshToken(user.refreshToken, user.accountId);
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@GetUser() user: AuthenUser, @Body() logoutBody: Logout) {
    return this.authService.handleLogout(user, logoutBody);
  }

  @Post('/send-verify-otp')
  async sendVerifyOtp(@Body() emailDTO: EmailDTO) {
    return this.authService.sendVerifyOtp(emailDTO.email);
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() verifyOtpDTO: VerifyOtpDTO) {
    return this.authService.verifyOtp(verifyOtpDTO.email, verifyOtpDTO.otp);
  }

  @Post('/send-reset-password')
  async getResetPassword(@Body() sendResetPasswordDTO: SendResetPasswordDTO) {
    return this.authService.sendResetPasswordEmail(
      sendResetPasswordDTO.email,
      sendResetPasswordDTO.clientUrl,
    );
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return this.authService.resetPassword(
      resetPasswordDTO.token,
      resetPasswordDTO.newPassword,
    );
  }
}
