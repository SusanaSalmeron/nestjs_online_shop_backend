import { ApiProperty } from "@nestjs/swagger";

export class OrderProductsOverviewDto {
    @ApiProperty()
    readonly product_name: string;
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