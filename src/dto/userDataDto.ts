import { ApiProperty } from "@nestjs/swagger"

export class UserDataDto {
    @ApiProperty()
    readonly id: number;
    @ApiProperty()
    readonly user_name: string;
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
    readonly date_of_birth: string;
    @ApiProperty()
    readonly identification: string;
    @ApiProperty()
    readonly password: string
}