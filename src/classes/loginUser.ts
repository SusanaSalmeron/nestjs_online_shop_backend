import { ApiProperty } from "@nestjs/swagger";

export class LoginUser {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string


    constructor(id, name, email, password) {
        this.id = id;
        this.name = name
        this.email = email;
        this.password = password
    }

}