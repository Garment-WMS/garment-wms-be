import { IsOptional } from 'class-validator';

export class UpdateInventoryStockDto {
  @IsOptional()
  quantityByPack: number;
}
