import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserAccountPasswordDto {
    @ApiProperty()
    readonly password: string;
    @ApiProperty()
    readonly newPassword: string;
    @ApiProperty()
    readonly repeatNew: string
}