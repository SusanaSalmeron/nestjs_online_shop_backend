import { ApiProperty } from "@nestjs/swagger"

export class UpdateBillingAddressDto {
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
    readonly identification: string;

}