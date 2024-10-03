// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
// } from '@nestjs/common';
// import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
// import { CreatePackagingUnitDto } from './dto/create-packaging-unit.dto';
// import { UpdatePackagingUnitDto } from './dto/update-packaging-unit.dto';
// import { PackagingUnitService } from './packaging-unit.service';

// @Controller('packaging-unit')
// export class PackagingUnitController {
//   constructor(private readonly packagingUnitService: PackagingUnitService) {}

//   @Post()
//   create(@Body() createPackagingUnitDto: CreatePackagingUnitDto) {
//     return this.packagingUnitService.create(createPackagingUnitDto);
//   }

//   @Get()
//   findAll() {
//     return this.packagingUnitService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', new CustomUUIDPipe()) id: string) {
//     return this.packagingUnitService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updatePackagingUnitDto: UpdatePackagingUnitDto,
//   ) {
//     return this.packagingUnitService.update(+id, updatePackagingUnitDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.packagingUnitService.remove(+id);
//   }
// }
