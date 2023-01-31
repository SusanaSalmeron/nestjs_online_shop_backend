import { ApiProperty } from "@nestjs/swagger";


export class CartProductDto {
    @ApiProperty()
    readonly id: number;
    @ApiProperty()
    readonly brand: string;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly color: string;
    @ApiProperty()
    readonly price: number;
    @ApiProperty()
    readonly image: string;
}