import { ApiProperty } from "@nestjs/swagger";


export class CreateProductToWishlistDto {
    @ApiProperty()
    readonly userId: number;
}