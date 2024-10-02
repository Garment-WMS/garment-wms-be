import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { CreateMaterialAttributeDto } from './dto/create-material-attribute.dto';
import { MaterialAttributeService } from './material-attribute.service';

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
  create(@Body() createMaterialAttributeDto: CreateMaterialAttributeDto) {
    return this.materialAttributeService.create(createMaterialAttributeDto);
  }
}
