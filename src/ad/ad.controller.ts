import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AdStatus, AdType, ForWhom, RentType } from '@prisma/client';
import { JwtAuthGuard } from 'src/guard/auth.guard';

@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAdDto: CreateAdDto, @Request() req) {
    const userId = req.user.id;
    return this.adService.create(createAdDto,userId);
  }

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'cityId', required: false })
  @ApiQuery({ name: 'rentType', required: false, enum: RentType })
  @ApiQuery({ name: 'adType', required: false, enum: AdType })
  @ApiQuery({ name: 'forWhom', required: false, enum: ForWhom })
  @ApiQuery({ name: 'status', required: false, enum: AdStatus })
  @ApiQuery({ name: 'priceFrom', required: false, example: 0 })
  @ApiQuery({ name: 'priceTo', required: false, example: 1000000 })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'orderBy', required: false, example: 'price' })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('cityId') cityId?: string,
    @Query('rentType') rentType?: RentType,
    @Query('adType') adType?: AdType,
    @Query('forWhom') forWhom?: ForWhom,
    @Query('status') status?: AdStatus,
    @Query('priceFrom') priceFrom?: string,
    @Query('priceTo') priceTo?: string,
    @Query('userId') userId?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.adService.findAll(Number(page) || 1, Number(limit) || 10, {
      cityId,
      rentType,
      adType,
      forWhom,
      status,
      userId,
      priceFrom: priceFrom ? Number(priceFrom) : undefined,
      priceTo: priceTo ? Number(priceTo) : undefined,
      orderBy,
      order,
    });
  }

  @Get('admin/:id')
  async findOneAdmin(@Param('id') id: string) {
    return this.adService.findOneAdmin(id);
  }
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.adService.findOne(id, req.user.id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adService.update(id, updateAdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adService.remove(id);
  }
}
