import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    telegramId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    photoUrl?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phoneNumber?: string;

}

