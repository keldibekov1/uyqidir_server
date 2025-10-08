import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  private readonly logger = new Logger(TelegramAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();

    // 🔥 Barcha headlarni chiqarib tashlaymiz
    this.logger.debug('HEADERS: ' + JSON.stringify(req.headers, null, 2));
    this.logger.debug('BODY: ' + JSON.stringify(req.body, null, 2));
    this.logger.debug('QUERY: ' + JSON.stringify(req.query, null, 2));

    const rawInit =
      (req.body && (req.body.initData ?? req.body.init_data)) ||
      (req.headers['x-telegram-init-data'] as string) ||
      (req.headers['x-telegram-initdata'] as string);

    this.logger.debug('rawInit: ' + rawInit);

    if (!rawInit) {
      this.logger.error('❌ initData topilmadi');
      throw new Error('initData topilmadi');
    }

    let params: URLSearchParams;
    try {
      params = new URLSearchParams(rawInit);
    } catch (e) {
      this.logger.error('❌ rawInit URLSearchParams qilib bo‘lmadi', e);
      throw new Error('initData not parsable');
    }

    const userParam = params.get('user');
    this.logger.debug('userParam: ' + userParam);

    if (!userParam) {
      this.logger.error('❌ user param topilmadi');
      throw new Error('user param topilmadi');
    }

    let userObj: any;
    try {
      userObj = JSON.parse(decodeURIComponent(userParam));
    } catch (e) {
      try {
        userObj = JSON.parse(userParam);
      } catch (err) {
        this.logger.error('❌ user JSON parse xatosi', err);
        throw new Error('user param JSON parse xatosi');
      }
    }

    req.user = {
      telegramId: String(userObj.id),
      firstName: userObj.first_name,
      lastName: userObj.last_name,
      username: userObj.username,
      photoUrl: userObj.photo_url,
    };

    this.logger.debug(`✅ Telegram user olindi: ${JSON.stringify(req.user)}`);

    return true;
  }
}
