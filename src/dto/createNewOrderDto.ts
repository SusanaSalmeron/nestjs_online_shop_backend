import { ApiProperty } from "@nestjs/swagger";
import { CreateOrderPositionDto } from "./createOrderProductsDto";

export class CreateNewOrderDto {
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly surname: string;
    @ApiProperty()
    readonly deliveryAddress: string;
    @ApiProperty()
    readonly postalZip: string;
    @ApiProperty()
    readonly city: string;
    @ApiProperty()
    readonly country: string
    @ApiProperty()
    readonly orderDate: string;
    @ApiProperty()
    readonly status: string;
    @ApiProperty()
    readonly products: CreateOrderPositionDto[];
}