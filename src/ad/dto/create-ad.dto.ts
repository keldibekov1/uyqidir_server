import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { AdStatus, AdType, ForWhom, RentType } from '@prisma/client';

export class CreateAdDto {




  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ default: 'UZS' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ enum: AdType })
  @IsEnum(AdType)
  adType: AdType;

  @ApiProperty({ enum: ForWhom })
  @IsEnum(ForWhom)
  forWhom: ForWhom;

  @ApiProperty({ enum: RentType })
  @IsEnum(RentType)
  rentType: RentType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalRooms: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  currentFloor?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalFloors?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ enum: AdStatus, required: false ,default: AdStatus.PENDING})
  @IsEnum(AdStatus)
  @IsOptional()
  status?: AdStatus;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  conditions?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalTenants?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  availableSpots?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  amenities?: string[];
}
