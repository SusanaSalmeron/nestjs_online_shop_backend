import { ApiProperty } from "@nestjs/swagger"

export class UserDataDto {
    @ApiProperty()
    readonly id: number;
    @ApiProperty()
    readonly userName: string;
    @ApiProperty()
    readonly surname: string;
    @ApiProperty()
    readonly address: string;
    @ApiProperty()
    readonly postalZip: string;
    @ApiProperty()
    readonly city: string;
    @ApiProperty()
    readonly country: string;
    @ApiProperty()
    readonly phone: string;
    @ApiProperty()
    readonly email: string;
    @ApiProperty()
    readonly dateOfBirth: string;
    @ApiProperty()
    readonly identification: string;
    @ApiProperty()
    readonly password: string
}