import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FromToValidationPipe implements PipeTransform {
  transform(value: any) {
    const { from, to } = value;

    if (new Date(from).getTime() > new Date(to).getTime()) {
      throw new BadRequestException(
        'The "to" date must be greater than or equal to the "from" date.',
      );
    }

    return value;
  }
}
