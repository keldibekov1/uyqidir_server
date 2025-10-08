import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCommentDto, userId: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id: data.adId },
    });

    if (!ad) {
      throw new NotFoundException('Elon topilmadi!');
    }

    return this.prisma.comment.create({
      data: {
        content: data.content,
        adId: data.adId,
        userId,
      },
    });
  }

  async findAll() {
    return await this.prisma.comment.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Komment topilmadi');
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
