import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdStatus, AdType, ForWhom, RentType } from '@prisma/client';

@Injectable()
export class AdService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAdDto, userId: string) {
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

    const finalImages = [] as string[];
    for (const name of data.images || []) {
      const tempPath = path.join(__dirname, '../../uploads/temp', name);
      const finalPath = path.join(__dirname, '../../uploads/final', name);

      try {
        if (fs.existsSync(tempPath)) {
          fs.renameSync(tempPath, finalPath);
          finalImages.push(`/uploads/final/${name}`);
        } else {
          console.warn(`${name} topilmadi, temp papkada yoq`);
        }
      } catch (err) {
        console.error(`Fayl kochirishda xatolik: ${name}`, err);
      }
    }

    const title = `${city.region.name}, ${city.name}`;

    const newAd = await this.prisma.ad.create({
      data: {
        title,
        price: data.price,
        currency: data.currency,
        images: finalImages,
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
        userId,
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

    return newAd;
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
          city: true,
        },
      }),
      this.prisma.ad.count({ where }),
    ]);
    return JSON.parse(
      JSON.stringify(
        {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          data,
        },
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    );
  }

  async findOne(id: string, userId?: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: {
        likes: {
          select: { userId: true }, // faqat userId olamiz (kimlar like bosganligini to‘liq emas)
        },
        user: true,
        city: { include: { region: true } },
        amenities: { include: { amenity: true } },
      },
    });

    if (!ad) throw new NotFoundException('Bunday elon topilmadi');

    const liked = userId
      ? ad.likes.some((like) => like.userId === userId)
      : false;
    const likeCount = ad.likes.length;

    const { likes, ...adWithoutLikes } = ad;

    const result = {
      ...adWithoutLikes,
      liked,
      likeCount,
    };

    return JSON.parse(
      JSON.stringify(result, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
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

    return JSON.parse(
      JSON.stringify(ad, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
  }
  async myAds(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.ad.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          city: { include: { region: true } },
          amenities: { include: { amenity: true } },
        },
      }),
      this.prisma.ad.count({ where: { userId } }),
    ]);

    return JSON.parse(
      JSON.stringify(
        {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          data,
        },
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    );
  }

  async update(id: string, data: UpdateAdDto) {
    try {
      const ad = await this.prisma.ad.findUnique({ where: { id } });
      if (!ad) throw new NotFoundException('Bunday elon topilmadi');

      const { cityId, amenities, ...rest } = data;

      const updated = await this.prisma.ad.update({
        where: { id },
        data: {
          ...rest,
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

      // 🔥 BigInt to string fix
      return JSON.parse(
        JSON.stringify(updated, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      );
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Elonni yangilab bolmadi');
    }
  }

  async remove(adId: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      throw new NotFoundException('Bunday elon topilmadi!');
    }

    // if (ad.userId !== userId) {
    //   throw new BadRequestException('Bu elon sizniki emas, aka!');
    // }

    if (ad.images && ad.images.length > 0) {
      ad.images.forEach((imgPath) => {
        const filePath = path.join(__dirname, '../../', imgPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Fayl o‘chirildi: ${filePath}`);
        }
      });
    }

    await this.prisma.ad.delete({
      where: { id: adId },
    });

    return { message: "Elon muvaqqiyatli o'chirildi!" };
  }
}
