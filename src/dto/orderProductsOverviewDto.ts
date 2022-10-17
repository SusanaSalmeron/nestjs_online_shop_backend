import { ApiProperty } from "@nestjs/swagger";

export class OrderProductsOverviewDto {
    @ApiProperty()
    readonly productName: string;
    @ApiProperty()
    readonly product_brand: string;
    @ApiProperty()
    readonly product_colour: string
    @ApiProperty()
    readonly price: number
    @ApiProperty()
    readonly units: number;
    @ApiProperty()
    readonly product_total: number;
}