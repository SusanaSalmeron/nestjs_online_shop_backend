import { ApiProperty } from "@nestjs/swagger";

export class LoginUser {
    @ApiProperty()
    id: number;
    @ApiProperty()
    user_name: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string


    constructor(id, user_name, email, password) {
        this.id = id;
        this.user_name = user_name
        this.email = email;
        this.password = password
    }

}