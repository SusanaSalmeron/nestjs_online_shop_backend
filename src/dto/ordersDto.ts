import { ApiProperty } from "@nestjs/swagger";


export class OrdersDto {
    @ApiProperty()
    readonly orderId: number;
    @ApiProperty()
    readonly userId: number;
    @ApiProperty()
    readonly deliveryAddressId: number;
    @ApiProperty()
    readonly orderDate: string;
    @ApiProperty()
    readonly shipped: boolean;
    @ApiProperty()
    readonly in_proccess: boolean;
}