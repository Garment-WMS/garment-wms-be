import { PartialType } from '@nestjs/swagger';
import { CreateMaterialAttributeDto } from './create-material-attribute.dto';

export class UpdateMaterialAttributeDto extends PartialType(CreateMaterialAttributeDto) {}
