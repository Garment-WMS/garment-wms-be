import { PartialType } from '@nestjs/swagger';
import { CreateMaterialVariantDto } from './create-material-variant.dto';

export class UpdateMaterialVariantDto extends PartialType(CreateMaterialVariantDto) {}
