import {
  isArray,
  isBoolean,
  isDate,
  isEmail,
  isEnum,
  isNumber,
  isPhoneNumber,
  isPostalCode,
  isString,
  isURL,
  isUUID,
  max,
  maxLength,
  min,
  minDate,
  minLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated'; // Adjust the path as necessary

export function IsNotEmptyCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.NOT_EMPTY',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value !== 'undefined' && value !== null && value !== '';
        },
      },
    });
  };
}

export function IsEmailCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEmailCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_EMAIL',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isEmail(value);
        },
      },
    });
  };
}

export function IsBooleanCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBooleanCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_BOOLEAN',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isBoolean(value);
        },
      },
    });
  };
}

export function IsNumberCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNumberCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_NUMBER',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isNumber(value);
        },
      },
    });
  };
}

export function IsStringCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_STRING',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isString(value);
        },
      },
    });
  };
}

export function IsDateCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_DATE',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isDate(value);
        },
      },
    });
  };
}

export function IsArrayCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isArrayCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_ARRAY',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isArray(value);
        },
      },
    });
  };
}

export function IsUUIDCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUUIDCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_UUID',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isUUID(value);
        },
      },
    });
  };
}

export function IsEnumCustom(
  enumType: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEnumCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_ENUM',
          {
            constraints: [Object.values(enumType).join(', ')],
          },
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isEnum(value, enumType);
        },
      },
    });
  };
}

export function MinLengthCustom(
  min: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minLengthCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_MIN_LENGTH',
          { constraints: min.toString() },
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return minLength(value, min);
        },
      },
    });
  };
}

export function MaxLengthCustom(
  max: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxLengthCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_MAX_LENGTH',
          { constraints: max.toString() },
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return maxLength(value, max);
        },
      },
    });
  };
}

export function MinDateCustom(
  date: Date,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minDateCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_MIN_DATE',
          { constraints: date.toString() },
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return minDate(value, date);
        },
      },
    });
  };
}

export function MaxCustom(
  maxNumber: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>('validation.MAX', {
          constraints: maxNumber.toString(),
        }),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return max(value, maxNumber);
        },
      },
    });
  };
}

export function MinCustom(
  minNumber: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>('validation.MIN', {
          constraints: minNumber.toString(),
        }),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return min(value, minNumber);
        },
      },
    });
  };
}

export function IsURLCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isURLCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_URL',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isURL(value);
        },
      },
    });
  };
}

export function IsPhoneNumberCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_PHONE_NUMBER',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isPhoneNumber(value);
        },
      },
    });
  };
}

export function IsPostalCodeCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPostalCodeCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_POSTAL_CODE',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isPostalCode(value, 'any');
        },
      },
    });
  };
}

export function IsDateStringCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateStringCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: i18nValidationMessage<I18nTranslations>(
          'validation.INVALID_DATE_STRING',
        ),
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isDate(value);
        },
      },
    });
  };
}
