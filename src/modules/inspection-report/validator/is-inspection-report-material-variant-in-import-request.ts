import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ImportRequestService } from 'src/modules/import-request/import-request.service';
import { CreateInspectionReportDto } from '../dto/inspection-report/create-inspection-report.dto';

export class IsInspectionReportDetailInImportRequestDetail
  implements ValidatorConstraintInterface
{
  constructor(private readonly importRequestService: ImportRequestService) {}

  readonly materialPackageIdPropertyName = 'materialPackageId';
  readonly productSizeIdPropertyName = 'productSizeId';

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    let createInspectionReportDto: CreateInspectionReportDto;
    try {
      createInspectionReportDto = value as CreateInspectionReportDto;
    } catch (error) {
      throw new Error('Value must be an instance of CreateInspectionReportDto');
    }

    switch (validationArguments.property) {
      case this.materialPackageIdPropertyName:
        const materialPackageIds =
          createInspectionReportDto.inspectionReportDetail.map(
            (materialVariant) => materialVariant.materialPackageId,
          );
        const isMaterialEveryVariantInImportRequest =
          await this.importRequestService.isInspectReportMaterialVariantInImportRequest(
            createInspectionReportDto.inspectionRequestId,
            materialPackageIds,
          );
        return isMaterialEveryVariantInImportRequest;

      case this.productSizeIdPropertyName:
        const productPackageIds =
          createInspectionReportDto.inspectionReportDetail.map(
            (productVariant) => productVariant.productSizeId,
          );
        const isProductEveryVariantInImportRequest =
          await this.importRequestService.isInspectReportProductVariantInImportRequest(
            createInspectionReportDto.inspectionRequestId,
            productPackageIds,
          );
        return isProductEveryVariantInImportRequest;

      default:
        throw new Error('Only material package and product size are allowed');
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    switch (validationArguments.property) {
      case this.materialPackageIdPropertyName:
        return 'Material package ids must be in import request';
      case this.productSizeIdPropertyName:
        return 'Product size ids must be in import request';
      default:
        return 'Internal server error: Only material package ids and product size ids are allowed to use this validator';
    }
  }
}

export function IsInspectionReportVariantInImportRequest() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsInspectionReportDetailInImportRequestDetail,
      async: true,
    });
  };
}
