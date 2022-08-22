import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserAccountDataDto {
    @ApiProperty()
    readonly user_name: string;
    @ApiProperty()
    readonly surname: string;
    @ApiProperty()
    readonly identification: string;
    @ApiProperty()
    readonly date_of_birth: string;
    @ApiProperty()
    readonly email: string;
    @ApiProperty()
    readonly phone: string;
}