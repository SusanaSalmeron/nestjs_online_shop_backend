import { ApiProperty } from "@nestjs/swagger";


export class UserSignupDto {
    @ApiProperty()
    readonly email: string;
    @ApiProperty()
    readonly password: string;
    @ApiProperty()
    readonly repeatPassword: string

}