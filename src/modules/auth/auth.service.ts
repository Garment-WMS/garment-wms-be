import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  Prisma,
  PrismaClient,
  RefreshToken,
  RoleCode,
  User,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { ValidationError } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { BlacklistTokenService } from '../blacklist-token/blacklist-token.service';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserService } from '../user/user.service';
import { AuthenUser } from './dto/authen-user.dto';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { Logout } from './dto/logout.dto';
import { SignUpDTO } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private config: ConfigService,
    private jwtService: JwtService,
    private blackListTokenService: BlacklistTokenService,
    private refreshTokenService: RefreshTokenService,
    private prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  async loginGeneral(body: LoginAuthDTO, role: RoleCode) {
    try {
      const account = await this.handleFindUser(body.email);
      if (!account) {
        const error: ValidationError[] = [
          {
            property: 'email',
            target: { body },
            constraints: {
              isEmailExist: 'Email not found',
            },
            children: [],
          },
        ];
        return apiFailed(404, 'Email not found', error);
      }
      const isMatch = await this.validatePassword(
        account.password,
        body.password,
      );

      const user = await this.checkRoleSchema(account.id, role);
      if (!user) {
        const error: ValidationError[] = [
          {
            property: 'role',
            target: { body },
            constraints: {
              isRole: 'Role not found',
            },
            children: [],
          },
        ];

        return apiFailed(404, 'Account not found', error);
      }

      if (isMatch) {
        const accessToken = await this.generateAccessToken(account, user, role);
        const refreshTokenResult =
          await this.refreshTokenService.generateRefreshToken(account);

        let refreshToken;
        if (refreshTokenResult?.refreshToken) {
          refreshToken = refreshTokenResult.refreshToken;
        }
        //If access token or refresh token is not generated
        if (accessToken === undefined || refreshToken === undefined) {
          const error: ValidationError[] = [
            {
              property: 'token',
              target: { body },
              constraints: {
                isToken: 'Token is not generated',
              },
              children: [],
            },
          ];
          return apiFailed(500, 'Token is not generated', error);
        }

        return apiSuccess(
          200,
          { accessToken, refreshToken, account },
          'Login success',
        );
      } else {
        const error: ValidationError[] = [
          {
            property: 'password',
            target: { body },
            value: body.password,
            constraints: {
              isMatch: 'Password not match',
            },
            children: [],
          },
        ];
        return apiFailed(400, 'Password not match', error);
      }
    } catch (e) {
      return apiFailed(500, e, 'Internal server error');
    }
  }

  //Use to check if roleSchema eg staffs, renters,... exist
  async checkRoleSchema(userId: string, role: RoleCode) {
    let checkRoleSchema = null;

    // switch (role) {
    //   case RoleCode.RENTER: {
    //     checkRoleSchema = await this.prisma.renter.findFirst({
    //       where: {
    //         userId: userId,
    //       },
    //     });
    //     break;
    //   }
    //   case RoleCode.STAFF: {
    //     checkRoleSchema = await this.prisma.staff.findFirst({
    //       where: {
    //         userId: userId,
    //       },
    //     });
    //     break;
    //   }
    //   // Admin hasn't done yet
    //   case RoleCode.ADMIN: {
    //     // checkRoleSchema = !!(await this.prisma.staff.findFirst({
    //     //   where: {
    //     //     userId: userId,
    //     //   },
    //     // }));
    //     break;
    //   }
    //   case RoleCode.TECHNICAL_STAFF: {
    //     checkRoleSchema = await this.prisma.technicalStaff.findFirst({
    //       where: {
    //         userId: userId,
    //       },
    //     });
    //     break;
    //   }
    //   case RoleCode.MANAGER: {
    //     checkRoleSchema = await this.prisma.manager.findFirst({
    //       where: {
    //         userId: userId,
    //       },
    //     });
    //     break;
    //   }
    //   case RoleCode.LANDLORD: {
    //     checkRoleSchema = await this.prisma.landLord.findFirst({
    //       where: {
    //         userId: userId,
    //       },
    //     });
    //     break;
    //   }
    //   default: {
    //     checkRoleSchema = false;
    //     break;
    //   }
    // }
    return checkRoleSchema;
  }

  async registerGeneral(user: SignUpDTO, roleInput: RoleCode) {
    // Ensure the transaction either succeeds or fails completely
    return await this.prisma.$transaction(
      async (prismaTransaction) => {
        try {
          //Hash user's password
          user.password = await this.hashPassword(user.password);

          //Create User type
          const userInput: User = {
            ...user,
            id: undefined,
            isDeleted: false,
            isVerified: false,
            avatarUrl: user.avatarUrl || '',
            cidId: user.cidId || undefined,
            // roleId: role.id,
            status: 'active',
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          };
          //Save the renter in DB
          const userResult = await prismaTransaction.user.create({
            data: {
              ...userInput,
            },
            // include: {
            //   role: true, // Include the role object in the result
            // },
          });
          if (!userResult) {
            return apiFailed(500, 'Created User failed');
          }

          const addRoleSchemaResult = await this.addRoleSchema(
            prismaTransaction,
            userResult.id,
            roleInput,
          );

          if (!addRoleSchemaResult) {
            throw new BadRequestException('Add role schema failed!');
          }

          const accessToken = await this.generateAccessToken(
            userResult,
            addRoleSchemaResult,
            roleInput,
          );

          //Generate refresh token and store it
          const refreshTokenResult =
            await this.refreshTokenService.generateRefreshToken(userResult);

          let refreshToken;
          if (refreshTokenResult?.refreshToken) {
            refreshToken = refreshTokenResult.refreshToken;
          }

          return apiSuccess(
            201,
            { accessToken, refreshToken, user: userResult },
            'Created user successfully',
          );
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
      {
        //After 10s will break
        timeout: 10000,
      },
    );
  }

  async addRoleSchema(
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    userId: string,
    role: RoleCode,
  ) {
    try {
      const schema: any = {
        id: undefined,
        userId: userId,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      };
      let result = null;
      // switch (role) {
      //   case RoleCode.RENTER: {
      //     result = await prisma.renter.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }
      //   case RoleCode.LANDLORD: {
      //     result = await prisma.landLord.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }
      //   case RoleCode.MANAGER: {
      //     result = await prisma.manager.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }
      //   case RoleCode.STAFF: {
      //     result = await prisma.staff.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }
      //   case RoleCode.TECHNICAL_STAFF: {
      //     result = await prisma.technicalStaff.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }

      //   default: {
      //     throw new BadRequestException('No role found!');
      //   }
      // }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async loginRoleCode(
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    userId: string,
    role: RoleCode,
  ) {
    try {
      const schema: any = {
        id: undefined,
        userId: userId,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      };
      let result = null;
      // switch (role) {
      //   case RoleCode.RENTER: {
      //     result = await prisma.renter.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }
      //   case RoleCode.LANDLORD: {
      //     result = await prisma.landLord.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }
      //   case RoleCode.MANAGER: {
      //     result = await prisma.manager.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }
      //   case RoleCode.STAFF: {
      //     result = await prisma.staff.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }
      //   case RoleCode.TECHNICAL_STAFF: {
      //     result = await prisma.technicalStaff.create({
      //       data: {
      //         ...schema,
      //       },
      //     });
      //     break;
      //   }

      //   default: {
      //     throw new BadRequestException('No role found!');
      //   }
      // }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async handleLogout(user: AuthenUser, logout: Logout) {
    try {
      const jwt = this.decodeJwt(user.accessToken);
      await this.blackListTokenService.createBlackListToken(
        user.accessToken,
        jwt.expiredAt,
      );
      const result = await this.refreshTokenService.updateRefreshTokenStatus(
        logout.refreshToken,
        false,
      );
      return apiSuccess(200, result, 'Logout successfully');
    } catch (e) {
      return apiSuccess(500, {}, 'Logout failed');
    }
  }

  generateAccessToken(account: { id: string }, user: any, roleCode: RoleCode) {
    const accessTokenExpiresIn = this.config.get('JWT_ACCESS_TOKEN_EXPIRY');

    let payload: any = {
      accountId: '',
      role: '',
    };

    // switch (roleCode) {
    //   case RoleCode.ADMIN: {
    //     payload = {
    //       accountId: account.id,
    //       role: roleCode,
    //     };
    //     payload.adminId = user.id;
    //     break;
    //   }
    //   case RoleCode.LANDLORD: {
    //     payload = {
    //       accountId: account.id,
    //       role: roleCode,
    //     };
    //     payload.landLordId = user.id;
    //     break;
    //   }
    //   case RoleCode.MANAGER: {
    //     payload = {
    //       accountId: account.id,
    //       role: roleCode,
    //     };
    //     payload.managerId = user.id;
    //     break;
    //   }
    //   case RoleCode.RENTER: {
    //     payload = {
    //       accountId: account.id,
    //       role: roleCode,
    //     };
    //     payload.renterId = user.id;
    //     break;
    //   }
    //   case RoleCode.STAFF: {
    //     payload = {
    //       accountId: account.id,
    //       role: roleCode,
    //     };
    //     payload.staffId = user.id;
    //     break;
    //   }
    //   case RoleCode.TECHNICAL_STAFF: {
    //     payload = {
    //       accountId: account.id,
    //       role: roleCode,
    //     };
    //     payload.technicalStaffId = user.id;
    //     break;
    //   }
    // }

    console.log();

    const secrect = this.config.get('JWT_SECRET');
    const accessToken = this.jwtService.sign(payload, {
      secret: secrect,
      expiresIn: accessTokenExpiresIn,
    });
    return accessToken;
  }

  async validatePassword(password, bodyPassword: string) {
    const isMatch = await bcrypt.compare(bodyPassword, password);
    return isMatch;
  }

  async hashPassword(password: string) {
    try {
      const saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS'));
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (e) {
      console.log(e);
    }
  }

  //Refresh token function
  async refreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.userService.findOneByUserId(userId);
      if (user) {
        const isRefreshTokenMatches =
          await this.refreshTokenService.validateRefreshToken(
            userId,
            refreshToken,
          );

        //Error if refresh token with status true not exist
        if (!isRefreshTokenMatches) {
          return apiFailed(401, 'Refresh token is invalid', 'UNAUTHORIZED');
        }

        //Change status of old refreshToken to false
        await this.refreshTokenService.updateRefreshTokenStatus(
          refreshToken,
          false,
        );
        let accessToken;
        console.log(user);
        // if (user.staffs) {
        //   accessToken = await this.generateAccessToken(
        //     user,
        //     user.staffs,
        //     RoleCode.STAFF,
        //   );
        // }
        // if (user.renters) {
        //   accessToken = await this.generateAccessToken(
        //     user,
        //     user.renters,
        //     RoleCode.RENTER,
        //   );
        // }
        // if (user.managers) {
        //   accessToken = await this.generateAccessToken(
        //     user,
        //     user.managers,
        //     RoleCode.MANAGER,
        //   );
        // }
        // if (user.landLords) {
        //   accessToken = await this.generateAccessToken(
        //     user,
        //     user.landLords,
        //     RoleCode.LANDLORD,
        //   );
        // }
        // if (user.technicalStaffs) {
        //   accessToken = await this.generateAccessToken(
        //     user,
        //     user.technicalStaffs,
        //     RoleCode.TECHNICAL_STAFF,
        //   );
        // }
        //Generate new token
        const newRefreshToken: RefreshToken =
          await this.refreshTokenService.generateRefreshToken(user);

        //If can't generate token
        if (!accessToken && !newRefreshToken) {
          return apiFailed(500, 'Server error can not generate token', null);
        }

        return apiSuccess(
          200,
          { accessToken, refreshToken: newRefreshToken.refreshToken },
          'Refresh token successfully',
        );
      }
      return apiFailed(403, 'Access Denied', 'ACCESS_DENIED');
    } catch (e) {
      if (e.code === 'P2025') {
        return apiFailed(401, 'Refresh token is invalid', 'UNAUTHORIZED');
      }
      console.log(e);
      return apiFailed(500, 'Internal server error', e);
    }
  }

  decodeJwt(jwt: string) {
    return this.jwtService.decode(jwt);
  }

  private async generateResetPasswordToken(userId: string, email: string) {
    const token = this.jwtService.sign(
      { userId, email },
      { secret: this.config.get('JWT_SECRET'), expiresIn: '30m' },
    );

    return token;
  }

  async sendResetPasswordEmail(email: string, clientUrl: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Email not registered');

    const resetPasswordToken = await this.generateResetPasswordToken(
      user.id,
      email,
    );

    const resetPasswordUrl = `${clientUrl}?token=${resetPasswordToken}`;

    await this.mailService.sendResetPassword(email, resetPasswordUrl);
    return apiSuccess(200, null, 'Email sent');
  }

  async handleFindUser(email: string) {
    return this.userService.findOne({
      email,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const { userId, email } = this.jwtService.verify(token, {
      secret: this.config.get('JWT_SECRET'),
    });

    const user = await this.userService.findOneByUserId(userId);
    if (!user) throw new BadRequestException('User not found');

    const hashPassword = await this.hashPassword(newPassword);
    await this.userService.updatePassword(userId, hashPassword);

    return apiSuccess(200, null, 'Password reset successfully');
  }

  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.userService.findOneByEmail(email);
    return user ? true : false;
  }

  async sendVerifyOtp(email: string): Promise<ApiResponse> {
    if (await this.isEmailExist(email)) {
      return apiFailed(409, 'Email already registered');
    }
    return await this.otpService.sendOTP(email);
  }

  async verifyOtp(email: string, otp: string) {
    return this.otpService.verifyOTP(email, otp);
  }
}
