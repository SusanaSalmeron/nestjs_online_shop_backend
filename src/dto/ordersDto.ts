import { ApiProperty } from "@nestjs/swagger";


export class OrdersDto {
    @ApiProperty()
    readonly order_id: number;
    @ApiProperty()
    readonly user_id: number;
    @ApiProperty()
    readonly delivery_address_id: number;
    @ApiProperty()
    readonly order_date: string;
    @ApiProperty()
    readonly shipped: boolean;
    @ApiProperty()
    readonly in_proccess: boolean;
}