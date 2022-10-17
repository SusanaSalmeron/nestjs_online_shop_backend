import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserAccountDataDto {
    @ApiProperty()
    readonly userName: string;
    @ApiProperty()
    readonly surname: string;
    @ApiProperty()
    readonly identification: string;
    @ApiProperty()
    readonly dateOfBirth: string;
    @ApiProperty()
    readonly email: string;
    @ApiProperty()
    readonly phone: string;
}