import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateMaterialAttributeDto } from './dto/create-material-attribute.dto';
import { UpdateMaterialAttributeDto } from './dto/update-material-attribute.dto';
import { MaterialAttributeService } from './material-attribute.service';
import { ArrayMaterialAttribute } from './dto/array-material-attribute.dto';

@Controller('material-attribute')
@ApiTags('Material Attribute')
export class MaterialAttributeController {
  constructor(
    private readonly materialAttributeService: MaterialAttributeService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiConflictResponse({
    description: 'Material Attribute already exist',
    example: {
      statusCode: 409,
      data: null,
      message: 'A unique constraint was violated on a record',
      errors: [
        {
          property: ['material_id', 'name'],
          contexts: {},
          children: [],
        },
      ],
    },
  })
  create(@Body() createMaterialAttributeDto: ArrayMaterialAttribute) {
    return this.materialAttributeService.create(createMaterialAttributeDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Body() updateMaterialAttributeDto: UpdateMaterialAttributeDto,
    @Param('id', CustomUUIDPipe) id: string,
  ) {
    return this.materialAttributeService.update(id, updateMaterialAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id', CustomUUIDPipe) id: string) {
    return this.materialAttributeService.remove(id);
  }
}
