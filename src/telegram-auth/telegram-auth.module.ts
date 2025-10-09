import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TelegramAuthService } from './telegram-auth.service';
import { TelegramAuthController } from './telegram-auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yomon_sir',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [TelegramAuthController],
  providers: [TelegramAuthService],
})
export class TelegramAuthModule {}
