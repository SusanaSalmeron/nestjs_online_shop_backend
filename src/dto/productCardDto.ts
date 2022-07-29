import { ApiProperty } from "@nestjs/swagger";

export class ProductCardDto {
    @ApiProperty()
    readonly id: string;
    @ApiProperty()
    readonly brand: string;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly price: string;
    @ApiProperty()
    readonly description: string;
    @ApiProperty()
    readonly product_type: string;
    @ApiProperty()
    readonly api_featured_image: string;
    @ApiProperty()
    readonly product_colors: string[];
}