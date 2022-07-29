import { ApiProperty } from "@nestjs/swagger";


export class ProductDto {
    @ApiProperty()
    readonly id: string;
    @ApiProperty()
    readonly brand: string;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly price: string;
    @ApiProperty()
    readonly api_featured_image: string;
}