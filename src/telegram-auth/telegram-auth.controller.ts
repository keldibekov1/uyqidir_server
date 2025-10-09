import { Controller, Post, Body } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';

@Controller('telegram')
export class TelegramAuthController {
  constructor(private readonly telegramAuthService: TelegramAuthService) {}

  @Post('validate')
  validateTelegramUser(@Body('initData') initData: string) {

    if (!initData) {
      return { success: false, message: 'initData topilmadi' };
    }

    return this.telegramAuthService.validateInitData(initData);
  }
}
