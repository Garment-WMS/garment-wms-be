import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class OptionalParseEnumPipe implements PipeTransform {
  constructor(private readonly enumType: Record<string, any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === '') {
      return undefined;
    }

    const enumValues = Object.values(this.enumType);
    if (!enumValues.includes(value)) {
      throw new BadRequestException(`${value} is not a valid enum value`);
    }

    return value;
  }
}
