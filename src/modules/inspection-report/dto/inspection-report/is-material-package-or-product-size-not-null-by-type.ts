import { $Enums } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsMaterialPackageOrProductSizeNotNullByType(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMaterialPackageOrProductSizeNotNullByType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          const object = args.object as any;
          const type = object.type;

          if (!Array.isArray(value)) {
            return false;
          }

          return value.every((detail) => {
            if (type === $Enums.InspectionReportType.MATERIAL) {
              return detail.materialPackageId != null;
            } else if (type === $Enums.InspectionReportType.PRODUCT) {
              return detail.productSizeId != null;
            }
            return false;
          });
        },
        defaultMessage(args: ValidationArguments) {
          const object = args.object as any;
          const type = object.type;

          if (type === $Enums.InspectionReportType.MATERIAL) {
            return 'All inspection report details must have a materialPackageId for MATERIAL type reports';
          } else if (type === $Enums.InspectionReportType.PRODUCT) {
            return 'All inspection report details must have a productSizeId for PRODUCT type reports';
          }
          return 'Invalid inspection report type';
        },
      },
    });
  };
}
