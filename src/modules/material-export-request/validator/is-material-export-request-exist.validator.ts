import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MaterialExportRequestService } from '../material-export-request.service';

@ValidatorConstraint({
  async: true,
})
export class IsMaterialExportRequestExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly materialExportRequestService: MaterialExportRequestService,
  ) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    let materialExportRequestId: string;
    try {
      materialExportRequestId = value as string;
    } catch (error) {
      return false;
    }
    const materialExportRequest =
      await this.materialExportRequestService.findFirst(
        materialExportRequestId,
      );
    return !!materialExportRequest;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new Error('Method not implemented.');
  }
}
