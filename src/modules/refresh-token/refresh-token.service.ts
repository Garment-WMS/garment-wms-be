import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}
  async test(createRefreshTokenDto: CreateRefreshTokenDto) {
    await this.prisma.$transaction(async (prismaInstance) => {
      const result = await prismaInstance.refreshToken.create({
        data: {
          accountId: 'ce30e8ea-ab23-4d89-81b2-9b660a13dbc7',
          refreshToken: 'createRefreshTokenDto.refreshToken',
          expiredAt: new Date(),
          status: true,
        },
      });

      const many = await this.prisma.refreshToken.findMany();
      console.log(many);
      const reulst3 = await prismaInstance.refreshToken.findUnique({
        where: {
          refreshToken: result.refreshToken,
        },
      });
      const reulst2 = await this.prisma.refreshToken.findUnique({
        where: {
          refreshToken: result.refreshToken,
        },
      });
      console.log(reulst3);
      console.log(reulst2);
      throw new Error('Error');
    });
  }

  updateRefreshTokenStatus(refreshTokenInput: string, arg1: boolean) {
    return this.prisma.refreshToken.update({
      where: {
        refreshToken: refreshTokenInput,
      },
      data: {
        status: false,
      },
    });
  }

  generateRefreshToken(user: { id: string; roleId?: string }) {
    const refreshTokenExpiresIn = this.config.get('JWT_REFRESH_TOKEN_EXPIRY');
    const secrect = this.config.get('JWT_REFRESH_SECRET');
    const refreshTokenResult = this.jwtService.sign(
      { userId: user.id },
      { secret: secrect, expiresIn: refreshTokenExpiresIn },
    );

    //Regex to get the number from env
    const numbers = refreshTokenExpiresIn.match(/\d+/g);
    const expiredAtTake = new Date();
    expiredAtTake.setDate(expiredAtTake.getDate() + parseInt(numbers[0]));

    if (refreshTokenResult) {
      const refreshToken: Prisma.RefreshTokenCreateInput = {
        accountId: user.id,
        refreshToken: refreshTokenResult,
        expiredAt: expiredAtTake,
      };
      const result = this.prisma.refreshToken.create({
        data: refreshToken,
      });
      if (result) {
        return result;
      }
    }
    return null;
  }

  async validateRefreshToken(userIdInput: string, refreshTokenInput: string) {
    try {
      const refreshTokenResult = await this.prisma.refreshToken.findFirst({
        where: {
          accountId: userIdInput,
          refreshToken: refreshTokenInput,
          status: true,
          expiredAt: {
            gte: new Date(),
          },
        },
      });
      return !!refreshTokenResult;
    } catch (error) {
      console.error('Error validating refresh token:', error);
      throw new Error('Refresh token validation failed');
    }
  }
}
