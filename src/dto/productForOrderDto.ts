import { ApiProperty } from "@nestjs/swagger";

export class ProductForOrderDto {
    @ApiProperty()
    readonly id: number;
    @ApiProperty()
    readonly colour_name: string;
    @ApiProperty()
    readonly units: number;
    @ApiProperty()
    readonly price: number;
}