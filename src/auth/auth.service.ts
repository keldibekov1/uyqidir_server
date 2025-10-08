// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { validate } from '@telegram-apps/init-data-node';

@Injectable()
export class AuthService {
  async loginWithTelegram(initData: string, botToken: string) {
    try {
      // initData — bu string (window.Telegram.WebApp.initData)
      validate(initData, botToken);

      // initData ni parse qilib foydalanuvchi olish
      const userData = JSON.parse(
        decodeURIComponent(
          new URLSearchParams(initData).get('user') || '{}',
        ),
      );

      return {
        token: 'fake-jwt-token', // JWT qo‘shib berasan
        user: userData,
      };
    } catch (e) {
      console.error('❌ Telegram initData validation error:', e);
      throw new UnauthorizedException('Telegram initData noto‘g‘ri yoki eskirgan');
    }
  }
}
