import { ApiProperty } from "@nestjs/swagger";

export class OptionsMenuDto {
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly value: string
}