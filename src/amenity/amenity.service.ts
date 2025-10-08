import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AmenityService {
    constructor(private prisma: PrismaService) {}
  
  async create(data: CreateAmenityDto) {
    return await this.prisma.amenity.create({ data });
  }

  async findAll() {
    return await this.prisma.amenity.findMany() ;
  }

   async findOne(id: string) {
      const amenity = await this.prisma.amenity.findUnique({ where: { id } });
      if (!amenity) throw new NotFoundException('Bunday amenity  topilmadi');
      return amenity;
    }

  async update(id: string, data: UpdateAmenityDto) {
    try {
      return await this.prisma.amenity.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Bunday amenity topilmadi');
    }
  }

   async remove(id: string) {
    try {
      return await this.prisma.amenity.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Bunday amenity topilmadi');
    }
  }
}
