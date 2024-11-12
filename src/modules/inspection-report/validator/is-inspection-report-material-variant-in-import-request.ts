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

  readonly materialVariantIdPropertyName = 'materialVariantId';
  readonly productVariantIdPropertyName = 'productVariantId';

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
      case this.materialVariantIdPropertyName:
        const materialVariantIds =
          createInspectionReportDto.inspectionReportDetail.map(
            (materialVariant) => materialVariant.materialPackageId,
          );
        const isMaterialEveryVariantInImportRequest =
          await this.importRequestService.isInspectReportMaterialVariantInImportRequest(
            createInspectionReportDto.inspectionRequestId,
            materialVariantIds,
          );
        return isMaterialEveryVariantInImportRequest;

      case this.productVariantIdPropertyName:
        const productVariantIds =
          createInspectionReportDto.inspectionReportDetail.map(
            (productVariant) => productVariant.productVariantId,
          );
        const isProductEveryVariantInImportRequest =
          await this.importRequestService.isInspectReportProductVariantInImportRequest(
            createInspectionReportDto.inspectionRequestId,
            productVariantIds,
          );
        return isProductEveryVariantInImportRequest;

      default:
        throw new Error(
          'Only materialVariantIds and productVariantIds are allowed',
        );
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    switch (validationArguments.property) {
      case this.materialVariantIdPropertyName:
        return 'Material variant ids must be in import request';
      case this.productVariantIdPropertyName:
        return 'Product variant ids must be in import request';
      default:
        return 'Internal server error: Only materialVariantIds and productVariantIds are allowed to use this validator';
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
