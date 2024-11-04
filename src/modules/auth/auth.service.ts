import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, PrismaClient, RefreshToken, RoleCode } from '@prisma/client';
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
      const userResult = await this.handleFindUser(body.email);
      if (!userResult) {
        const error: ValidationError[] = [
          {
            property: 'email',
            target: { ...body },
            constraints: {
              isEmailExist: 'Email not found',
            },
            children: [],
          },
        ];
        return apiFailed(404, 'Email not found', error);
      }
      const isMatch = await this.validatePassword(
        userResult.password,
        body.password,
      );

      const user = await this.checkRoleSchema(userResult.id, role);
      if (!user) {
        const error: ValidationError[] = [
          {
            property: 'role',
            target: { ...body },
            constraints: {
              isRole: 'Role not found',
            },
            children: [],
          },
        ];

        return apiFailed(404, 'User not found', error);
      }

      if (isMatch) {
        const accessToken = await this.generateAccessToken(
          userResult,
          user,
          role,
        );
        const refreshTokenResult =
          await this.refreshTokenService.generateRefreshToken(userResult);

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
          { accessToken, refreshToken, user: userResult },
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

    switch (role) {
      case RoleCode.WAREHOUSE_STAFF: {
        checkRoleSchema = await this.prisma.warehouseStaff.findFirst({
          where: {
            accountId: userId,
          },
        });
        break;
      }
      case RoleCode.FACTORY_DIRECTOR: {
        checkRoleSchema = await this.prisma.factoryDirector.findFirst({
          where: {
            accountId: userId,
          },
        });
        break;
      }
      case RoleCode.WAREHOUSE_MANAGER: {
        checkRoleSchema = await this.prisma.warehouseManager.findFirst({
          where: {
            accountId: userId,
          },
        });
        break;
      }
      case RoleCode.INSPECTION_DEPARTMENT: {
        checkRoleSchema = await this.prisma.inspectionDepartment.findFirst({
          where: {
            accountId: userId,
          },
        });
        break;
      }
      case RoleCode.PRODUCTION_DEPARTMENT: {
        checkRoleSchema = await this.prisma.productionDepartment.findFirst({
          where: {
            accountId: userId,
          },
        });
        break;
      }
      case RoleCode.PURCHASING_STAFF: {
        checkRoleSchema = await this.prisma.purchasingStaff.findFirst({
          where: {
            accountId: userId,
          },
        });
        break;
      }
    }

    return checkRoleSchema;
  }

  async registerGeneral(user: SignUpDTO, roleInput: RoleCode) {
    // Ensure the transaction either succeeds or fails completely
    return await this.prisma.$transaction(
      async (prismaTransaction: PrismaClient) => {
        //Hash user's password
        user.password = await this.hashPassword(user.password);
        const { role, ...ress } = user;
        //Create User type
        const userInput: Prisma.AccountCreateInput = {
          ...ress,
          id: undefined,
          isDeleted: false,
          isVerified: false,
          avatarUrl: user.avatarUrl || undefined,
          cidId: user.cidId || undefined,
          // roleId: role.id,
          status: 'active',
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        };
        const userResult = await prismaTransaction.account.create({
          data: {
            ...userInput,
          },
          include: {
            warehouseStaff: true,
            warehouseManager: true,
            factoryDirector: true,
            inspectionDepartment: true,
            productionDepartment: true,
            purchasingStaff: true,
          },
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
          {
            accessToken,
            refreshToken,
            user: await prismaTransaction.account.findUnique({
              where: {
                id: userResult.id,
              },
              include: {
                warehouseStaff: true,
                warehouseManager: true,
                factoryDirector: true,
                inspectionDepartment: true,
                productionDepartment: true,
                purchasingStaff: true,
              },
            }),
          },
          'Created user successfully',
        );
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
        accountId: userId,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      };
      let result = null;

      switch (role) {
        case RoleCode.WAREHOUSE_STAFF: {
          result = await prisma.warehouseStaff.create({
            data: {
              ...schema,
            },
          });
          break;
        }
        case RoleCode.FACTORY_DIRECTOR: {
          result = await prisma.factoryDirector.create({
            data: {
              ...schema,
            },
          });
          break;
        }
        case RoleCode.WAREHOUSE_MANAGER:
          {
            result = await prisma.warehouseManager.create({
              data: {
                ...schema,
              },
            });
          }
          break;

        case RoleCode.INSPECTION_DEPARTMENT: {
          result = await prisma.inspectionDepartment.create({
            data: {
              ...schema,
            },
          });
          break;
        }

        case RoleCode.PRODUCTION_DEPARTMENT: {
          result = await prisma.productionDepartment.create({
            data: {
              ...schema,
            },
          });
          break;
        }
        case RoleCode.PURCHASING_STAFF: {
          result = await prisma.purchasingStaff.create({
            data: {
              ...schema,
            },
          });
          break;
        }
      }
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

  generateAccessToken(
    user: { id: string },
    userRoleData: any,
    roleCode: RoleCode,
  ) {
    const accessTokenExpiresIn = this.config.get('JWT_ACCESS_TOKEN_EXPIRY');

    let payload: any = {
      userId: '',
      role: '',
    };

    switch (roleCode) {
      case RoleCode.WAREHOUSE_STAFF: {
        payload = {
          userId: user.id,
          role: roleCode,
        };
        payload.warehouseStaffId = userRoleData.id;
        break;
      }
      case RoleCode.FACTORY_DIRECTOR: {
        payload = {
          userId: user.id,
          role: roleCode,
        };
        payload.factoryDirectorId = userRoleData.id;
        break;
      }
      case RoleCode.WAREHOUSE_MANAGER: {
        payload = {
          userId: user.id,
          role: roleCode,
        };
        payload.warehouseManagerId = userRoleData.id;
        break;
      }
      case RoleCode.INSPECTION_DEPARTMENT: {
        payload = {
          userId: user.id,
          role: roleCode,
        };
        payload.inspectionDepartmentId = userRoleData.id;
        break;
      }
      case RoleCode.PRODUCTION_DEPARTMENT: {
        payload = {
          userId: user.id,
          role: roleCode,
        };
        payload.productionDepartmentId = userRoleData.id;
        break;
      }
      case RoleCode.PURCHASING_STAFF: {
        payload = {
          userId: user.id,
          role: roleCode,
        };
        payload.purchasingStaffId = userRoleData.id;
        break;
      }
    }
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
          return apiFailed(401, 'Refresh token is invalid', ['UNAUTHORIZED']);
        }
        //Change status of old refreshToken to false
        //Try catch to ignore error if have
        try {
          await this.refreshTokenService.updateRefreshTokenStatus(
            refreshToken,
            false,
          );
        } catch (error) {}
        let accessToken;
        if (user.warehouseStaff) {
          accessToken = await this.generateAccessToken(
            user,
            user.warehouseStaff,
            RoleCode.WAREHOUSE_STAFF,
          );
        }
        if (user.warehouseManager) {
          accessToken = await this.generateAccessToken(
            user,
            user.warehouseManager,
            RoleCode.WAREHOUSE_MANAGER,
          );
        }
        if (user.factoryDirector) {
          accessToken = await this.generateAccessToken(
            user,
            user.factoryDirector,
            RoleCode.FACTORY_DIRECTOR,
          );
        }
        if (user.inspectionDepartment) {
          accessToken = await this.generateAccessToken(
            user,
            user.inspectionDepartment,
            RoleCode.INSPECTION_DEPARTMENT,
          );
        }
        if (user.productionDepartment) {
          accessToken = await this.generateAccessToken(
            user,
            user.productionDepartment,
            RoleCode.PRODUCTION_DEPARTMENT,
          );
        }
        if (user.purchasingStaff) {
          accessToken = await this.generateAccessToken(
            user,
            user.purchasingStaff,
            RoleCode.PURCHASING_STAFF,
          );
        }

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
      return apiFailed(HttpStatus.FORBIDDEN, 'Access Denied', [
        'ACCESS_DENIED',
      ]);
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
