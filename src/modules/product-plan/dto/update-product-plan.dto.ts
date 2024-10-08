import { PartialType } from '@nestjs/swagger';
import { CreateProductPlanDto } from './create-product-plan.dto';

export class UpdateProductPlanDto extends PartialType(CreateProductPlanDto) {}
