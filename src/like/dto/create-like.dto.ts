import { ApiProperty } from "@nestjs/swagger";

export class CreateLikeDto {
    @ApiProperty()
    adId: string
}
