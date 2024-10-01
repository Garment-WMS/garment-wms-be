import { Prisma } from '@prisma/client';

export class CreateMaterialDto implements Prisma.MaterialCreateInput {
  name: string;
  code: string;
  width: number;
  height: number;
  length: number;
  minQuantity?: number;
  weight: number;
  id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
  uomPerPackagingUnit: number;
  exportMaterialRequestDetail?: Prisma.ExportMaterialRequestDetailCreateNestedManyWithoutMaterialInput;
  importRequestDetail?: Prisma.ImportRequestDetailCreateNestedManyWithoutMaterialInput;
  inspectionReportDetail?: Prisma.InspectionReportDetailCreateNestedManyWithoutMaterialInput;
  materialType: Prisma.MaterialTypeCreateNestedOneWithoutMaterialInput;
  packagingUnit: Prisma.PackagingUnitCreateNestedOneWithoutMaterialInput;
  uom: Prisma.UomCreateNestedOneWithoutMaterialInput;
  materialAttribute?: Prisma.MaterialAttributeCreateNestedManyWithoutMaterialInput;
  materialInspectionCriteria?: Prisma.MaterialInspectionCriteriaCreateNestedManyWithoutMaterialInput;
  materialReceipt?: Prisma.MaterialReceiptCreateNestedManyWithoutMaterialInput;
  poDeliveryDetail?: Prisma.PoDeliveryDetailCreateNestedManyWithoutMaterialInput;
  productFormula?: Prisma.ProductFormulaCreateNestedManyWithoutMaterialInput;
  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsUUID()
  // materialTypeId: string;

  // //   @ApiProperty({})
  // //   @IsNotEmpty()
  // //   @IsUUID()
  // //   unitId: string;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsString()
  // @MinLength(1)
  // @MaxLength(50)
  // name: string;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsString()
  // @MinLength(3)
  // @MaxLength(10)
  // code: string;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsNumber()
  // @Min(0)
  // width: number;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsNumber()
  // @Min(0)
  // height: number;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsNumber()
  // @Min(0)
  // length: number;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsNumber()
  // @Min(0)
  // weight: number;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsNumber()
  // @Min(0)
  // minQuantity: number;
}
