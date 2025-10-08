import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }
  @Post('by-region')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        regionId: {
          type: 'string',
          example: 'c3fbb0b3-1e8b-4c8a-8af1-5d0c3c0d9e44',
        },
        cities: {
          type: 'array',
          items: { type: 'string' },
          example: ['Andijon shahri', 'Asaka tumani', 'Xonobod shahri'],
        },
      },
      required: ['regionId', 'cities'],
    },
  })
  async createManyByRegion(
    @Body('regionId') regionId: string,
    @Body('cities') cities: string[],
  ) {
    return this.cityService.createManyByRegion(regionId, cities);
  }
  
  @ApiQuery({ name: 'search', required: false, example: 'Tosh' })
  @ApiQuery({ name: 'filter', required: false, example: 'clx123regionid' })
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('filter') filter?: string,
  ) {
    return this.cityService.findAll(search, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityService.remove(id);
  }
}
