import { ApiProperty } from "@nestjs/swagger";
import { OrderProductsOverviewDto } from "./orderProductsOverviewDto";

export class OrderOverviewDto {
    @ApiProperty()
    readonly orderId: number;
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
    readonly orderDate: string;
    @ApiProperty()
    readonly status: string;
    @ApiProperty()
    readonly products: OrderProductsOverviewDto[];
    @ApiProperty()
    readonly totalOrder: number;




}