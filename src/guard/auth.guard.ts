import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let request: Request = context.switchToHttp().getRequest();
    let authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token topilmadi yoki notogri formatda');
    }

    let token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token mavjud emas');
    }

    try {
      let data = this.jwt.verify(token, { secret: 'secret' });
      request['user'] = data;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token notogri yoki muddati otgan');
    }
  }
}