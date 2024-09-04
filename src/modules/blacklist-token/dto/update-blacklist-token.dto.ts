import { PartialType } from '@nestjs/swagger';
import { CreateBlacklistTokenDto } from './create-blacklist-token.dto';

export class UpdateBlacklistTokenDto extends PartialType(CreateBlacklistTokenDto) {}
