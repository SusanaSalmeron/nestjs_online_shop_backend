import { ApiProperty } from "@nestjs/swagger";

export class DeleteAddressDto {
    @ApiProperty()
    readonly addressId: string;
    @ApiProperty()
    readonly userId: string;
}