import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCode } from '@prisma/client';
import { I18nService, I18nValidationError } from 'nestjs-i18n';
import { PrismaService } from 'prisma/prisma.service';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { AuthenUser } from 'src/modules/auth/dto/authen-user.dto';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { CustomAuthException } from '../filter/custom-http.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
    private i18n: I18nService<I18nTranslations>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<RoleCode[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: Partial<AuthenUser> = request.user;
    let query = '';
    for (const role of requiredRoles) {
      // switch (role) {
      //   case RoleCode.LANDLORD:
      //     if (user.landLordId) {
      //       const landLord = await this.prismaService.landLord.findUnique({
      //         where: { id: user.landLordId },
      //       });
      //       if (landLord) {
      //         return true;
      //       }
      //     }
      //     break;
      //   case RoleCode.RENTER:
      //     if (user.renterId) {
      //       const renter = await this.prismaService.renter.findUnique({
      //         where: { id: user.renterId },
      //       });
      //       if (renter) {
      //         return true;
      //       }
      //     }
      //     break;
      //   case RoleCode.MANAGER:
      //     if (user.managerId) {
      //       const manager = await this.prismaService.manager.findUnique({
      //         where: { id: user.managerId },
      //       });
      //       if (manager) {
      //         return true;
      //       }
      //     }
      //     break;
      //   case RoleCode.STAFF:
      //     if (user.staffId) {
      //       const staff = await this.prismaService.staff.findUnique({
      //         where: { id: user.staffId },
      //       });
      //       if (staff) {
      //         return true;
      //       }
      //     }
      //     break;
      //   case RoleCode.TECHNICAL_STAFF:
      //     if (user.technicalStaffId) {
      //       const technicalStaff =
      //         await this.prismaService.technicalStaff.findUnique({
      //           where: { id: user.technicalStaffId },
      //         });
      //       if (technicalStaff) {
      //         return true;
      //       }
      //     }
      //     break;
      //   case RoleCode.ADMIN:
      //     if (user.role === RoleCode.ADMIN) {
      //       return true;
      //     }
      //     break;
      //   default:
      //     break;
      // }
    }

    let error: I18nValidationError = {
      property: '',
    };
    throw new CustomAuthException(403, this.i18n.t('auth.forbidden'), [error]);
  }
}
