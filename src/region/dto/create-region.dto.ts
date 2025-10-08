import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRegionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
