import { ApiProperty } from "@nestjs/swagger";

export class LoginUser {
    @ApiProperty()
    id: number;
    @ApiProperty()
    userName: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string


    constructor(id, userName, email, password) {
        this.id = id;
        this.userName = userName
        this.email = email;
        this.password = password
    }

}