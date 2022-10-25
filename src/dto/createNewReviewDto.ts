import { ApiProperty } from "@nestjs/swagger";

export class CreateNewReviewDto {
    @ApiProperty()
    readonly productId: string;
    @ApiProperty()
    readonly productName: string;
    @ApiProperty()
    readonly rating: number;
    @ApiProperty()
    readonly comment: string;
}