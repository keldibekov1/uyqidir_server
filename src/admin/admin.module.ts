import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
  exports: [AdminService, JwtModule],
})
export class AdminModule {}
