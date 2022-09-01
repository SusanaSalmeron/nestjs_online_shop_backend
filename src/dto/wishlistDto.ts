import { ApiProperty } from "@nestjs/swagger";

export class WishlistDto {
    @ApiProperty()
    readonly userId: number;
    @ApiProperty()
    readonly productId: number;
}