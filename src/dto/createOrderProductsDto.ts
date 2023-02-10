import { ApiProperty } from "@nestjs/swagger";


export class CreateOrderPositionDto {
    @ApiProperty()
    readonly productId: number;
    @ApiProperty()
    readonly productName: string;
    @ApiProperty()
    readonly colour_name: string;
    @ApiProperty()
    readonly units: number;
    @ApiProperty()
    readonly total: number;
}