import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RegionModule } from './region/region.module';
import { CityModule } from './city/city.module';
import { AdminModule } from './admin/admin.module';
import { AdModule } from './ad/ad.module';
import { AmenityModule } from './amenity/amenity.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { UploadModule } from './upload/upload.module';
import { TelegramAuthModule } from './telegram-auth/telegram-auth.module';

@Module({
  imports: [UserModule,PrismaModule, AuthModule, RegionModule, CityModule, AdminModule, AdModule, AmenityModule, CommentModule, LikeModule, UploadModule, TelegramAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
