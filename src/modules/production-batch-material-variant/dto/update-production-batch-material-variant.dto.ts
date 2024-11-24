import { PartialType } from '@nestjs/swagger';
import { CreateProductionBatchMaterialVariantDto } from './create-production-batch-material-variant.dto';

export class UpdateProductionBatchMaterialVariantDto extends PartialType(CreateProductionBatchMaterialVariantDto) {}
