import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRegionDto) {
    return this.prisma.region.create({ data });
  }

  async findAll() {
    return this.prisma.region.findMany();
  }

  async findOne(id: string) {
    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) throw new NotFoundException('Bunday region topilmadi');
    return region;
  }

  async update(id: string, data: UpdateRegionDto) {
    try {
      return await this.prisma.region.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Bunday region topilmadi');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.region.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Bunday region topilmadi');
    }
  }
}
