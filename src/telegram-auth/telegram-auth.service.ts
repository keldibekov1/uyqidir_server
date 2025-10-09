import { Injectable, UnauthorizedException } from '@nestjs/common';
import { validate } from '@telegram-apps/init-data-node';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { first } from 'rxjs';

@Injectable()
export class TelegramAuthService {
  private readonly botToken =
    process.env.TELEGRAM_BOT_TOKEN ||
    '';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateInitData(initData: string) {
    function convertBigIntToString(obj: any) {
      return JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      );
    }

    try {
      validate(initData, this.botToken);

      const params = new URLSearchParams(initData);
      const userData = params.get('user');

      if (!userData) {
        throw new UnauthorizedException('User maʼlumotlari topilmadi');
      }

      const user = JSON.parse(userData);

      // 3️⃣ DB’da foydalanuvchini topamiz yoki yaratamiz

      const existing = await this.prisma.user.findUnique({
        where: { telegramId: user.id },
      });

      let savedUser;

      if (existing) {
        const isChanged =
          existing.firstName !== user.first_name ||
          existing.lastName !== user.last_name ||
          existing.username !== user.username ||
          existing.photoUrl !== user.photo_url;

        if (isChanged) {
          savedUser = await this.prisma.user.update({
            where: { telegramId: user.id },
            data: {
              firstName: user.first_name,
              lastName: user.last_name,
              username: user.username,
              photoUrl: user.photo_url,
              lastLoginAt: new Date(),
            },
          });
        } else {
          savedUser = await this.prisma.user.update({
            where: { telegramId: user.id },
            data: { lastLoginAt: new Date() },
          });
        }
      } else {
        savedUser = await this.prisma.user.create({
          data: {
            telegramId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            photoUrl: user.photo_url,
            lastLoginAt: new Date(),
          },
        });
      }

      const payload = {
        id: savedUser.id,
        firstName: savedUser.firstName,
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: '30d',
        secret: process.env.JWT_SECRET || 'secret',
      });


      return {
        success: true,
        message: 'Init data valid ✅',
        user: convertBigIntToString(savedUser),
        token,
      };
    } catch (error) {
      console.error('❌ Telegram init data error:', error.message);
      throw new UnauthorizedException('Invalid or expired init data');
    }
  }
}
