import { PartialType } from '@nestjs/swagger';
import { CreateTelegramAuthDto } from './create-telegram-auth.dto';

export class UpdateTelegramAuthDto extends PartialType(CreateTelegramAuthDto) {}
