// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   ValidationPipe,
// } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { Prisma, Role } from '@prisma/client';
// import { I18nValidationPipe } from 'nestjs-i18n';
// import { apiSuccess } from 'src/common/dto/api-response';
// import { ApiResponse } from 'src/common/dto/response.dto';
// import { CreateRoleReqDto } from './dto/create-role-req.dto';
// import { UpdateRoleReqDto } from './dto/update-role-req.dto';
// import { RoleService } from './role.service';

// @Controller('role')
// @ApiTags('role')
// export class RoleController {
//   constructor(private readonly roleService: RoleService) {}

//   @Get()
//   async roles(): Promise<ApiResponse> {
//     const result = await this.roleService.roles({});
//     return apiSuccess(200, result, 'Get role successfully');
//   }

//   @Get(':id')
//   async role(@Param('id') id: string): Promise<ApiResponse> {
//     const result = await this.roleService.role({ id: id });
//     return apiSuccess(200, result, 'Get role successfully');
//   }

//   @Post()
//   async createRole(
//     @Body(new I18nValidationPipe()) createRoleReqDto: CreateRoleReqDto,
//   ): Promise<Role> {
//     const role: Prisma.RoleCreateInput = {
//       name: createRoleReqDto.name,
//       code: createRoleReqDto.code,
//     };
//     return this.roleService.createRole(role);
//   }

//   @Post('bulk')
//   async createManyRoles(
//     @Body() roles: CreateRoleReqDto[],
//   ): Promise<Prisma.BatchPayload> {
//     const data: Prisma.RoleCreateManyInput[] = roles.map((role) => ({
//       name: role.name,
//       code: role.code,
//     }));
//     return this.roleService.createManyRoles(data);
//   }

//   @Patch(':id')
//   async updateRole(
//     @Param('id') id: string,
//     @Body(new ValidationPipe()) updateRoleReqDto: UpdateRoleReqDto,
//   ): Promise<Role> {
//     const role: Prisma.RoleUpdateInput = {
//       name: updateRoleReqDto.name,
//       code: updateRoleReqDto.code,
//     };
//     return this.roleService.updateRole({ where: { id: id }, data: role });
//   }

//   @Delete('bulk')
//   async deleteManyRoles(@Body() ids: string[]): Promise<Prisma.BatchPayload> {
//     const data: Prisma.RoleWhereInput = { id: { in: ids } };
//     return this.roleService.deleteManyRoles(data);
//   }

//   @Delete(':id')
//   async deleteRole(@Param('id') id: string): Promise<Role> {
//     return this.roleService.deleteRole({ id: id });
//   }
// }
