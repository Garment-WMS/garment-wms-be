import { $Enums } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsImportRequestDetailMatchType(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isImportRequestDetailMatchType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          const type = object.type as $Enums.ImportRequestType;

          if (!Array.isArray(value)) {
            return false;
          }

          switch (type) {
            case 'MATERIAL_BY_PO':
            case 'MATERIAL_RETURN':
            case 'MATERIAL_NOT_BY_PO':
              return value.every(
                (detail) => detail.materialPackageId !== undefined,
              );
            case 'PRODUCT_BY_BATCH':
            case 'PRODUCT_RETURN':
            case 'PRODUCT_NOT_BY_BATCH':
              return value.every(
                (detail) => detail.productIdSizeId !== undefined,
              );
            default:
              return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `importRequestDetails do not match the type ${args.object['type']}`;
        },
      },
    });
  };
}
