import { ApiProperty } from "@nestjs/swagger"

export class UserDataDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    user_name: string;
    @ApiProperty()
    surname: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    postalZip: string;
    @ApiProperty()
    city: string;
    @ApiProperty()
    country: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    date_of_birth: string;
    @ApiProperty()
    identification: string;
    @ApiProperty()
    password: string
}