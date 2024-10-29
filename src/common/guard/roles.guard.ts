import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCode } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenUser } from 'src/modules/auth/dto/authen-user.dto';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { CustomAuthException } from '../filter/custom-auth-http.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
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
      switch (role) {
        case RoleCode.WAREHOUSE_STAFF: {
          if (user?.purchasingStaffId) {
            let purchasingStaff;
            try {
              purchasingStaff =
                await this.prismaService.purchasingStaff.findUnique({
                  where: { id: user.purchasingStaffId },
                });
            } catch (error) {
              return false;
            }
            if (purchasingStaff) {
              return true;
            }
          }
        }
        case RoleCode.WAREHOUSE_MANAGER: {
          if (user?.warehouseManagerId) {
            let warehouseManager;
            try {
              warehouseManager =
                await this.prismaService.warehouseManager.findUnique({
                  where: { id: user.warehouseManagerId },
                });
            } catch (error) {
              return false;
            }
            if (warehouseManager) {
              return true;
            }
          }
        }
        case RoleCode.PRODUCTION_DEPARTMENT: {
          if (user?.productionDepartmentId) {
            let productionDepartment;
            try {
              productionDepartment =
                await this.prismaService.productionDepartment.findUnique({
                  where: { id: user.productionDepartmentId },
                });
            } catch (error) {
              return false;
            }
            if (productionDepartment) {
              return true;
            }
          }
        }
        case RoleCode.INSPECTION_DEPARTMENT: {
          if (user?.inspectionDepartmentId) {
            let inspectionDepartment;
            try {
              inspectionDepartment =
                await this.prismaService.inspectionDepartment.findUnique({
                  where: { id: user.inspectionDepartmentId },
                });
            } catch (error) {
              return false;
            }
            if (inspectionDepartment) {
              return true;
            }
          }
        }
        case RoleCode.FACTORY_DIRECTOR: {
          if (user?.factoryDirectorId) {
            let factoryDirector;
            try {
              factoryDirector =
                await this.prismaService.factoryDirector.findUnique({
                  where: { id: user.factoryDirectorId },
                });
            } catch (error) {
              return false;
            }
            if (factoryDirector) {
              return true;
            }
          }
        }

        case RoleCode.WAREHOUSE_STAFF: {
          if (user?.warehouseStaffId) {
            let warehouseStaff;
            try {
              warehouseStaff =
                await this.prismaService.warehouseStaff.findUnique({
                  where: { id: user.warehouseStaffId },
                });
            } catch (error) {
              return false;
            }
            if (warehouseStaff) {
              return true;
            }
          }
        }

        case RoleCode.PURCHASING_STAFF: {
          if (user?.purchasingStaffId) {
            let purchasingStaff;
            try {
              purchasingStaff =
                await this.prismaService.purchasingStaff.findUnique({
                  where: { id: user.purchasingStaffId },
                });
            } catch (error) {
              return false;
            }
            if (purchasingStaff) {
              return true;
            }
          }
        }
        default:
          break;
      }
    }
    throw new CustomAuthException(403, 'Forbidden', ['UNAUTHORIZED']);
  }
}
