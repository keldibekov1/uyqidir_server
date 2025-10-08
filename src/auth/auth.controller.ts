// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  async telegramLogin(@Body('initData') initData: string) {
    const botToken = process.env.BOT_TOKEN || '8246791982:AAE8gmHZFlT0nbe0JqYaR2rn6j6VnEX1sZM';
    return this.authService.loginWithTelegram(initData, botToken);
  }
}
