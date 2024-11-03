import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable } from '@nestjs/common';
import { Account, Prisma, RoleCode } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { ImageService } from '../image/image.service';

@Injectable()
export class UserService {
  async search(findOptions: GeneratedFindOptions<Prisma.AccountWhereInput>) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.account.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: userInclude,
      }),
      this.prisma.account.count(
        findOptions?.where
          ? {
              where: findOptions.where,
            }
          : undefined,
      ),
    ]);
    return {
      data,
      total,
    };
  }
  async getAllUserByRole(role: RoleCode) {
    let result;
    switch (role) {
      case RoleCode.FACTORY_DIRECTOR:
        result = await this.prisma.factoryDirector.findMany({
          include: {
            account: true,
          },
        });
      case RoleCode.WAREHOUSE_STAFF:
        result = await this.prisma.warehouseStaff.findMany({
          include: {
            account: true,
          },
        });
      case RoleCode.INSPECTION_DEPARTMENT:
        result = await this.prisma.inspectionDepartment.findMany({
          include: {
            account: true,
          },
        });
      case RoleCode.PURCHASING_STAFF:
        result = await this.prisma.purchasingStaff.findMany({
          include: {
            account: true,
          },
        });
      case RoleCode.PRODUCTION_DEPARTMENT:
        result = await this.prisma.productionDepartment.findMany({
          include: {
            account: true,
          },
        });
      case RoleCode.WAREHOUSE_MANAGER:
        result = await this.prisma.warehouseManager.findMany({
          include: {
            account: true,
          },
        });
      default:
        break;
    }

    if (!result) {
      return apiFailed(404, 'Role not found');
    }
    return apiSuccess(200, result, 'Get all user by role successfully');
  }

  async update() {}

  async IsUserRoleExist(value: any, role: RoleCode) {
    console.log(value, role);
    switch (role) {
      case RoleCode.FACTORY_DIRECTOR:
        return await this.prisma.factoryDirector.findFirst({
          where: {
            id: value,
          },
        });
      case RoleCode.WAREHOUSE_STAFF:
        console.log(value);
        return await this.prisma.warehouseStaff.findFirst({
          where: {
            id: value,
          },
        });
      case RoleCode.INSPECTION_DEPARTMENT:
        return await this.prisma.inspectionDepartment.findFirst({
          where: {
            id: value,
          },
        });
      case RoleCode.PURCHASING_STAFF:
        return await this.prisma.purchasingStaff.findFirst({
          where: {
            id: value,
          },
        });
      case RoleCode.PRODUCTION_DEPARTMENT:
        return await this.prisma.productionDepartment.findFirst({
          where: {
            id: value,
          },
        });
      case RoleCode.WAREHOUSE_MANAGER:
        return await this.prisma.warehouseManager.findFirst({
          where: {
            id: value,
          },
        });
      default:
        return null;
    }
  }
  constructor(
    private prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  async findOne(query: Prisma.AccountWhereInput): Promise<Account | undefined> {
    return await this.prisma.account.findFirst({
      where: query,
      include: {
        factoryDirector: true,
        warehouseStaff: true,
        inspectionDepartment: true,
        purchasingStaff: true,
        productionDepartment: true,
        warehouseManager: true,
      },
    });
  }

  async addAvatar(file: Express.Multer.File, userInput: AuthenUser) {
    try {
      //Get the user
      const user: Account = await this.findOneByUserId(userInput.userId);
      const imageUrl = await this.imageService.addImageToFirebase(
        file,
        user.id,
        PathConstants.USER_PATH,
      );
      if (!imageUrl) {
        return apiFailed(404, 'Upload avatar failed');
      }

      //Delete the current image in firebase
      if (user.avatarUrl !== null) {
        try {
          await this.imageService.deleteImage(
            user.id,
            user.avatarUrl,
            PathConstants.USER_PATH,
          );
        } catch (error) {
          console.error('Error deleting image:', error);
          // Continue execution even if there is an error
        }
      }

      //Update avatar url
      const newUser = await this.prisma.account.update({
        where: {
          id: user.id,
        },
        data: {
          avatarUrl: imageUrl,
        },
      });

      return apiSuccess(200, newUser, 'Update avatar successfully');
    } catch (error) {
      throw error;
    }
  }

  async findOneByUserId(userId: string) {
    console.log(userId);
    return await this.prisma.account.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        factoryDirector: true,
        warehouseStaff: true,
        inspectionDepartment: true,
        purchasingStaff: true,
        productionDepartment: true,
        warehouseManager: true,
      },
    });
  }

  findOneByUserName(usernameInput: string) {
    return this.prisma.account.findFirstOrThrow({
      where: {
        username: usernameInput,
      },
      // include: {
      //   role: true,
      // },
    });
  }

  async validateUser(username: string, password: string) {
    return await this.prisma.account.findFirst({
      where: {
        AND: [
          {
            username: username,
            password: password,
          },
        ],
      },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.account.findFirst({
      where: {
        email: email,
      },
      // include: {
      //   role: true,
      // },
    });
  }

  async updatePassword(id: string, newPassword: string) {
    return await this.prisma.account.update({
      where: {
        id: id,
      },
      data: {
        password: newPassword,
      },
    });
  }
}

export const userInclude: Prisma.AccountInclude = {
  factoryDirector: true,
  warehouseStaff: true,
  inspectionDepartment: true,
  purchasingStaff: true,
  productionDepartment: true,
  warehouseManager: true,
};
