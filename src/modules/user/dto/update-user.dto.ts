import { OmitType } from '@nestjs/swagger';
import { SignUpDTO } from 'src/modules/auth/dto/sign-up.dto';

export class UpdateUserDTO extends OmitType(SignUpDTO, ['password']) {}
