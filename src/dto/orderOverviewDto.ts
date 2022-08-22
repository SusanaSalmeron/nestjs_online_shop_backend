import { ApiProperty } from "@nestjs/swagger";
import { OrderProductsOverviewDto } from "./orderProductsOverviewDto";

export class OrderOverviewDto {
    @ApiProperty()
    readonly order_id: number;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly surname: string;
    @ApiProperty()
    readonly address: string;
    @ApiProperty()
    readonly postalZip: string;
    @ApiProperty()
    readonly city: string;
    @ApiProperty()
    readonly country: string;
    @ApiProperty()
    readonly order_date: string;
    @ApiProperty()
    readonly status: string;
    @ApiProperty()
    readonly products: OrderProductsOverviewDto[];
    @ApiProperty()
    readonly total_order: number;




}