import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: AdminRole, default: AdminRole.ADMIN })
  @IsEnum(AdminRole)
  role: AdminRole;
}

export class LoginAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
