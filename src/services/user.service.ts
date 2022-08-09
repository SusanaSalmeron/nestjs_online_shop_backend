import { Inject, Injectable, Logger } from "@nestjs/common";
import { LoginUser } from "../classes/loginUser";
import { AccountUserData } from '../classes/accountUserData'
import * as loki from 'lokijs';
import { AccountUserAddresses } from "src/classes/accountUserAddresses";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name)
    constructor(@Inject('DATABASE_CONNECTION') private db: loki) { }

    async findUserByEmail(email: string): Promise<LoginUser> {
        const usersTable = this.db.getCollection('users')
        const foundUser: LoginUser = usersTable.findOne({ email: email })
        if (foundUser) {
            return new LoginUser(
                foundUser.id,
                foundUser.name,
                foundUser.email,
                foundUser.password
            )
        } else {
            return null
        }
    }

    async findUserById(id: string): Promise<AccountUserData> {
        const usersTable = this.db.getCollection('users')
        try {
            const foundUserData: AccountUserData = usersTable.findOne({ id: parseInt(id) })
            console.log(foundUserData)
            if (foundUserData) {
                return new AccountUserData(
                    foundUserData.id,
                    foundUserData.user_name,
                    foundUserData.surname,
                    foundUserData.address,
                    foundUserData.postalZip,
                    foundUserData.city,
                    foundUserData.country,
                    foundUserData.phone,
                    foundUserData.email,
                    foundUserData.date_of_birth,
                    foundUserData.identification,
                    foundUserData.password)
            } else {
                return null
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
        }
    }

    async findAddressesBy(userId: string): Promise<AccountUserAddresses[]> {
        const addressesTable = this.db.getCollection('addresses')
        let addresses
        try {
            const foundAddresses: AccountUserAddresses[] = addressesTable.find({ userId: parseInt(userId) })
            if (foundAddresses) {
                addresses = foundAddresses.map(a => {
                    return new AccountUserAddresses(
                        a.id,
                        a.user_name,
                        a.surname,
                        a.address,
                        a.postalZip,
                        a.city,
                        a.country,
                        a.defaultAddress,
                        a.userId
                    )
                })
            } else {
                return null
            }
        } catch (err) {
            this.logger.error('Internal Server Error, err')
        }
        return addresses
    }
}