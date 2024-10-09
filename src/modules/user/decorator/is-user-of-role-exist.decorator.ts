import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { RoleCode } from '@prisma/client';
import { UserService } from '../user.service';

@Injectable()
export class IsUserRoleExistPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const role = metadata.data as RoleCode;
    const user = await this.userService.IsUserRoleExist(value, role);
    if (!user) {
      throw new NotFoundException(
        `User with id ${value} and role ${role} not found`,
      );
    }
    return value;
  }
}
