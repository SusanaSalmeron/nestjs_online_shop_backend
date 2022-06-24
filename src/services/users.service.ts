import { Inject, Injectable, Logger } from "@nestjs/common";
import * as loki from 'lokijs';
import { User } from "src/classes/user";

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)
    constructor(@Inject('DATABASE_CONNECTION') private db: loki) { }

    async findUserByEmail(email: string): Promise<User> {
        const usersTable = this.db.getCollection('users')
        const foundUser: User = usersTable.findOne({ email: email })
        if (foundUser) {
            return new User(
                foundUser.id,
                foundUser.name,
                foundUser.email,
                foundUser.password
            )
        } else {
            return null
        }
    }
}