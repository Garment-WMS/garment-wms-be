import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlacklistTokenService } from './blacklist-token.service';
import { CreateBlacklistTokenDto } from './dto/create-blacklist-token.dto';
import { UpdateBlacklistTokenDto } from './dto/update-blacklist-token.dto';

@Controller('blacklist-token')
export class BlacklistTokenController {
  constructor(private readonly blacklistTokenService: BlacklistTokenService) {}
}
