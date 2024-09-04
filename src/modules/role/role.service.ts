// import { Injectable } from '@nestjs/common';
// import { Prisma, Role, RoleCode } from '@prisma/client';
// import { PrismaService } from 'prisma/prisma.service';

// @Injectable()
// export class RoleService {
//   constructor(private readonly prisma: PrismaService) {}

//   async role(roleWhereUniqueInput: Prisma.RoleWhereUniqueInput): Promise<Role> {
//     return this.prisma.role.findUniqueOrThrow({
//       where: roleWhereUniqueInput,
//     });
//   }

//   findRoleByCode(codeInput: RoleCode): Promise<Role> {
//     return this.prisma.role.findFirstOrThrow({
//       where: { code: codeInput },
//     });
//   }

//   async roles(params: {
//     skip?: number;
//     take?: number;
//     cursor?: Prisma.RoleWhereUniqueInput;
//     where?: Prisma.RoleWhereInput;
//     orderBy?: Prisma.RoleOrderByWithRelationInput;
//   }): Promise<Role[]> {
//     const { skip, take, cursor, where, orderBy } = params;
//     return this.prisma.role.findMany({
//       skip,
//       take,
//       cursor,
//       where,
//       orderBy,
//     });
//   }

//   async createRole(data: Prisma.RoleCreateInput): Promise<Role> {
//     return this.prisma.role.create({
//       data,
//     });
//   }

//   async createManyRoles(
//     data: Prisma.RoleCreateManyInput[],
//   ): Promise<Prisma.BatchPayload> {
//     return this.prisma.role.createMany({
//       data,
//     });
//   }

//   async updateRole(params: {
//     where: Prisma.RoleWhereUniqueInput;
//     data: Prisma.RoleUpdateInput;
//   }): Promise<Role> {
//     const { where, data } = params;
//     return this.prisma.role.update({
//       data,
//       where,
//     });
//   }

//   async updateManyRoles(params: {
//     where: Prisma.RoleWhereInput;
//     data: Prisma.RoleUpdateManyMutationInput;
//   }): Promise<Prisma.BatchPayload> {
//     const { where, data } = params;
//     return this.prisma.role.updateMany({
//       data,
//       where,
//     });
//   }

//   async deleteRole(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
//     return this.prisma.role.delete({
//       where,
//     });
//   }

//   async deleteManyRoles(
//     where: Prisma.RoleWhereInput,
//   ): Promise<Prisma.BatchPayload> {
//     return this.prisma.role.deleteMany({
//       where,
//     });
//   }
// }
