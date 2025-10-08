import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdStatus, AdType, ForWhom, RentType } from '@prisma/client';

@Injectable()
export class AdService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAdDto) {
    if (data.adType === 'ROOMMATE') {
      if (data.totalTenants == null || data.availableSpots == null) {
        throw new BadRequestException(
          'Xonadosh elonida totalTenants va availableSpots majburiy',
        );
      }
    }

    const city = await this.prisma.city.findUnique({
      where: { id: data.cityId },
      include: { region: true },
    });
    if (!city) {
      throw new BadRequestException('Bunday shahar mavjud emas');
    }

    const forWhomMap = {
      FAMILY: 'Oila uchun',
      FEMALE: 'Ayollar uchun',
      MALE: 'Erkaklar uchun',
      STUDENT_GIRLS: 'Talaba qizlar uchun',
      STUDENT_BOYS: 'Talaba yigitlar uchun',
    };

    const forWhomText = forWhomMap[data.forWhom];
    const roomsText = data.totalRooms ? `${data.totalRooms} xonali ` : '';
    const title = `${city.region.name}, ${city.name} ${roomsText}${forWhomText} `;

    return await this.prisma.ad.create({
      data: {
        title,
        price: data.price,
        currency: data.currency,
        images: data.images,
        totalRooms: data.totalRooms,
        currentFloor: data.currentFloor,
        totalFloors: data.totalFloors,
        address: data.address,
        status: AdStatus.PENDING,
        latitude: data.latitude,
        longitude: data.longitude,
        conditions: data.conditions,
        adType: data.adType,
        forWhom: data.forWhom,
        rentType: data.rentType,
        totalTenants: data.totalTenants,
        availableSpots: data.availableSpots,
        userId: data.userId,
        cityId: data.cityId,
        amenities: {
          create:
            data.amenities?.map((amenityId) => ({
              amenity: { connect: { id: amenityId } },
            })) || [],
        },
      },
      include: {
        amenities: { include: { amenity: true } },
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      cityId?: string;
      rentType?: RentType;
      adType?: AdType;
      forWhom?: ForWhom;
      status?: AdStatus;
      priceFrom?: number;
      priceTo?: number;
      userId?: string;
      orderBy?: string;
      order?: 'asc' | 'desc';
    },
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters) {
      if (filters.cityId) where.cityId = filters.cityId;
      if (filters.rentType) where.rentType = filters.rentType;
      if (filters.adType) where.adType = filters.adType;
      if (filters.forWhom) where.forWhom = filters.forWhom;
      if (filters.status) where.status = filters.status;
      if (filters.userId) where.userId = filters.userId;

      if (filters.priceFrom || filters.priceTo) {
        where.price = {};
        if (filters.priceFrom) where.price.gte = filters.priceFrom;
        if (filters.priceTo) where.price.lte = filters.priceTo;
      }
    }

    const orderBy = {};

    if (filters?.orderBy) {
      orderBy[filters.orderBy] = filters?.order === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy['createdAt'] = filters?.order === 'asc' ? 'asc' : 'desc';
    }

    const [data, total] = await Promise.all([
      this.prisma.ad.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: true,
          city: true,
          amenities: { include: { amenity: true } },
        },
      }),
      this.prisma.ad.count({ where }),
    ]);

    return {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async findOne(id: string, userId?: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: { likes: true },
    });

    if (!ad) throw new NotFoundException('Bunday ad topilmadi');

    return {
      ...ad,
      liked: userId ? ad.likes.some((like) => like.userId === userId) : false,
      likeCount: ad.likes.length,
    };
  }

  async findOneAdmin(id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: {
        user: true,
        city: { include: { region: true } },
        amenities: { include: { amenity: true } },
      },
    });

    if (!ad) throw new NotFoundException('Bunday ad topilmadi');

    return ad;
  }

  async update(id: string, data: UpdateAdDto) {
    try {
      const ad = await this.prisma.ad.findUnique({ where: { id } });
      if (!ad) throw new NotFoundException('Bunday elon topilmadi');

      const { userId, cityId, amenities, ...rest } = data;

      return await this.prisma.ad.update({
        where: { id },
        data: {
          ...rest,

          ...(userId ? { user: { connect: { id: userId } } } : {}),

          ...(cityId ? { city: { connect: { id: cityId } } } : {}),

          ...(amenities
            ? {
                amenities: {
                  deleteMany: {},
                  create: amenities.map((amenityId) => ({
                    amenity: { connect: { id: amenityId } },
                  })),
                },
              }
            : {}),
        },
        include: {
          user: true,
          city: true,
          amenities: { include: { amenity: true } },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Elonni yangilab bolmadi');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.ad.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Bunday ad topilmadi');
    }
  }
}
