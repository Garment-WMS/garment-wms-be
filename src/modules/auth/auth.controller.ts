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
import { TestDto } from './dto/test-validator.dto';
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
    RoleCode.FACTORY_DIRECTOR,
    RoleCode.WAREHOUSE_MANAGER,
    RoleCode.WAREHOUSE_STAFF,
  )
  testAuth(@GetUser() user) {
    return user;
  }

  @Post('/test-validator')
  testAuthValidator(@Body() user: TestDto) {
    return user;
  }

  //SIGN IN FLOW
  @Post('/sign-in/warehouse-staff')
  @UsePipes(new ValidationPipe())
  warehouseStaffLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.WAREHOUSE_STAFF);
  }

  @Post('/sign-in/warehouse-manager')
  @UsePipes(new ValidationPipe())
  warehouseManagerLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.WAREHOUSE_MANAGER);
  }

  @Post('/sign-in/purchasing-staff')
  @UsePipes(new ValidationPipe())
  purchasingStaffLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.PURCHASING_STAFF);
  }

  @Post('/sign-in/inspection-department')
  @UsePipes(new ValidationPipe())
  inspectionDepartmentLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.INSPECTION_DEPARTMENT);
  }

  @Post('/sign-in/production-department')
  @UsePipes(new ValidationPipe())
  productionDepartmentLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.PRODUCTION_DEPARTMENT);
  }
  @Post('/sign-in/factory-director')
  @UsePipes(new ValidationPipe())
  factoryDirectorLogin(@Body() body: LoginAuthDTO) {
    return this.authService.loginGeneral(body, RoleCode.FACTORY_DIRECTOR);
  }

  //SIGN UP FLOW
  @Post('/sign-up/warehouse-staff')
  warehouseStaffSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.WAREHOUSE_STAFF);
  }

  @Post('/sign-up/warehouse-manager')
  warehosueManagerSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.WAREHOUSE_MANAGER);
  }
  @Post('/sign-up/purchasing-staff')
  purchasingStaffSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.PURCHASING_STAFF);
  }
  @Post('/sign-up/production-department')
  productionDepartmentSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(
      body,
      RoleCode.PRODUCTION_DEPARTMENT,
    );
  }
  @Post('/sign-up/inspection-department')
  inspectionDepartmentSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(
      body,
      RoleCode.INSPECTION_DEPARTMENT,
    );
  }
  @Post('/sign-up/factory-director')
  factoryDirectorSignUp(@Body() body: SignUpDTO) {
    return this.authService.registerGeneral(body, RoleCode.FACTORY_DIRECTOR);
  }

  @Get('/refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  refreshToken(@GetUser() user: AuthenUser) {
    console.log('refresh token', user);
    return this.authService.refreshToken(user.refreshToken, user.userId);
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
