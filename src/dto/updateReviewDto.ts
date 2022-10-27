import { ApiProperty } from "@nestjs/swagger";

export class UpdateReviewDto {
    @ApiProperty()
    readonly productId: number;
    @ApiProperty()
    readonly rating: number;
    @ApiProperty()
    readonly comment: string;
}