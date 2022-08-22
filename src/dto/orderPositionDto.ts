import { ApiProperty } from "@nestjs/swagger";

export class OrderPosition {
    @ApiProperty()
    readonly id: number;
    @ApiProperty()
    readonly order_id: number;
    @ApiProperty()
    readonly product_id: number;
    @ApiProperty()
    readonly colour_name: string;
    @ApiProperty()
    readonly units: number;
    @ApiProperty()
    readonly total: number;
}