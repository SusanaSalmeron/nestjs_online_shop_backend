import { ApiProperty } from "@nestjs/swagger";

export class ProductCardDto {
    @ApiProperty()
    readonly id: number;
    @ApiProperty()
    readonly brand: string;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly price: string;
    @ApiProperty()
    readonly description: string;
    @ApiProperty()
    readonly productType: string;
    @ApiProperty()
    readonly api_featured_image: string;
    @ApiProperty()
    readonly product_colors: string[];
}