import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async createOrUpdate(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { telegramId: data.telegramId },
    });

    if (existing) {
      const isChanged =
        existing.firstName !== data.firstName ||
        existing.lastName !== data.lastName ||
        existing.username !== data.username ||
        existing.photoUrl !== data.photoUrl;

      if (isChanged) {
        return await this.prisma.user.update({
          where: { telegramId: data.telegramId },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            photoUrl: data.photoUrl,
            lastLoginAt: new Date(),
          },
        });
      }

      await this.prisma.user.update({
        where: { telegramId: data.telegramId },
        data: { lastLoginAt: new Date() },
      });

      return existing;
    }

    return await this.prisma.user.create({
      data: {
        telegramId: data.telegramId,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        photoUrl: data.photoUrl,
        lastLoginAt: new Date(),
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }
    return await this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }
    return await this.prisma.user.delete({ where: { id } });
  }
}
