import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, createLikeDto: CreateLikeDto) {
    const existing = await this.prisma.adLike.findUnique({
      where: {
        userId_adId: {
          userId,
          adId: createLikeDto.adId,
        },
      },
    });

    if (existing) {
      await this.prisma.adLike.delete({
        where: {
          userId_adId: {
            userId,
            adId: createLikeDto.adId,
          },
        },
      });

      return { liked: false };
    } else {
      await this.prisma.adLike.create({
        data: {
          userId,
          adId: createLikeDto.adId,
        },
      });

      return { liked: true };
    }
  }

  async count(adId: string) {
    return this.prisma.adLike.count({
      where: { adId },
    });
  }

  async findUserLikes(userId: string) {
    return this.prisma.adLike.findMany({
      where: { userId },
      include: { ad: true },
    });
  }
}
