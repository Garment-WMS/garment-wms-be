// import { HttpStatus, Injectable } from '@nestjs/common';
// import { isUUID } from 'class-validator';
// import { PrismaService } from 'prisma/prisma.service';
// import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
// import { CreatePackagingUnitDto } from './dto/create-packaging-unit.dto';
// import { UpdatePackagingUnitDto } from './dto/update-packaging-unit.dto';

// @Injectable()
// export class PackagingUnitService {
//   constructor(private readonly prismaService: PrismaService) {}
//   async create(createPackagingUnitDto: CreatePackagingUnitDto) {
//     const result = await this.prismaService.packagingUnit.create({
//       data: { ...createPackagingUnitDto },
//     });
//     if (result) {
//       return apiSuccess(
//         HttpStatus.CREATED,
//         result,
//         'Packaging Unit created successfully',
//       );
//     }
//     return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Packaging Unit');
//   }
//   async findById(id: string) {
//     if (!isUUID(id)) {
//       return null;
//     }
//     const result = await this.prismaService.packagingUnit.findUnique({
//       where: { id },
//     });
//     return result;
//   }
//   async findAll() {
//     const result = await this.prismaService.packagingUnit.findMany();
//     return apiSuccess(HttpStatus.OK, result, 'Packaging Units found');
//   }

//   async findOne(id: string) {
//     const result = this.findById(id);

//     if (result) {
//       return apiSuccess(HttpStatus.OK, result, 'Packaging Unit found');
//     }
//     return apiFailed(HttpStatus.NOT_FOUND, 'Packaging Unit not found');
//   }

//   update(id: number, updatePackagingUnitDto: UpdatePackagingUnitDto) {
//     return `This action updates a #${id} packagingUnit`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} packagingUnit`;
//   }
// }
