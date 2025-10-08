import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCityDto) {
    return await this.prisma.city.create({ data });
  }
  async createManyByRegion(regionId: string, cities: string[]) {
    if (!cities || !cities.length) {
      throw new Error('Hech bo‘lmasa bitta shahar kiriting, aka');
    }

    const data = cities.map((name) => ({
      name,
      regionId,
    }));

    await this.prisma.city.createMany({
      data,
      skipDuplicates: true,
    });

    return {
      message: `${cities.length} ta shahar/tuman muvaffaqiyatli qo‘shildi`,
      region_id: regionId,
    };
  }

  async findAll(search?: string, filter?: string) {
    const AND: any[] = [];
    if (search) {
      AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          {
            region: {
              name: { contains: search, mode: 'insensitive' as const },
            },
          },
        ],
      });
    }
    if (filter) {
      AND.push({ regionId: filter });
    }
    const where = AND.length > 0 ? { AND } : {};

    const [data, total] = await Promise.all([
      this.prisma.city.findMany({
        where,
        include: { region: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.city.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string) {
    try {
      return await this.prisma.city.findUniqueOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException('Bunday city topilmadi');
    }
  }

  async update(id: string, data: UpdateCityDto) {
    try {
      return this.prisma.city.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Bunday city topilmadi');
    }
  }

  async remove(id: string) {
    try {
      return this.prisma.city.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Bunday city topilmadi');
    }
  }
}
