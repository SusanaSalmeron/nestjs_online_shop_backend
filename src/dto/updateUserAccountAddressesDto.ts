import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserAccountAddressesDto {
    @ApiProperty()
    readonly id: string;
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
    readonly defaultAddress: boolean;
}