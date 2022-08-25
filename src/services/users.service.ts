import { Inject, Injectable, Logger } from "@nestjs/common";
import { LoginUser } from "../classes/loginUser";
import { AccountUserData } from '../classes/accountUserData'
import * as loki from 'lokijs';
import { AccountUserAddresses } from "../classes/accountUserAddresses";
import { encrypt } from './security.service';
import * as bcrypt from 'bcrypt'
import { UpdateBillingAddress } from "../classes/updateBillingAddresses";
import { ProductsService } from "./products.service";
import { CreateUserAddressDto } from "src/dto/createUserAddressDto";
import { DeleteAddressDto } from "src/dto/deleteAddressDto";


@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)
    private addressId = 32
    constructor(@Inject('DATABASE_CONNECTION') private db: loki, private productService: ProductsService) { }


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
            this.logger.error('Internal Server Error', err)
        }
        return addresses
    }

    async addNewShippingAddress(userId: string, createUserAddressDto: CreateUserAddressDto): Promise<number> {
        const addressesTable = this.db.getCollection('addresses')
        const { user_name, surname, address, postalZip, city, country, defaultAddress } = createUserAddressDto
        console.log(userId + "from usersService")
        const newId: number = this.addressId++
        addressesTable.insert(
            {
                id: newId,
                user_name: user_name,
                surname: surname,
                address: address,
                postalZip: postalZip,
                city: city,
                country: country,
                defaultAddress: defaultAddress,
                userId: parseInt(userId),
            }
        )

        console.log(newId)
        return newId
    }

    async deleteAddress(deleteAddressDto: DeleteAddressDto): Promise<boolean> {
        const { addressId, userId } = deleteAddressDto
        const addressesTable = this.db.getCollection('addresses')
        const address = addressesTable.findOne({ id: parseInt(addressId) })
        console.log(userId)
        if (address.userId === parseInt(userId)) {
            addressesTable.remove(address)
            return true
        } else {
            return false
        }
    }

    async changeUserAccountPassword(userId: string, password: string, newPassword: string, repeatNew: string): Promise<boolean> {
        const usersTable = this.db.getCollection('users')
        try {
            const user = usersTable.findOne({ id: parseInt(userId) })
            const match = await bcrypt.compare(password, user.password)
            if ((user && match) && newPassword === repeatNew) {
                user.password = await encrypt(newPassword)
                return usersTable.update(user)
            } else {
                return false
            }
        } catch (err) {
            this.logger.error('Internal Server Error, err')
        }
    }

    async changeUserAccountData(userId: string, user_name: string, surname: string, identification: string, date_of_birth: string, email: string, phone: string): Promise<boolean> {
        const usersTable = this.db.getCollection('users')
        try {
            const user = usersTable.findOne({ id: parseInt(userId) })
            if (user) {
                user.user_name = user_name;
                user.surname = surname;
                user.identification = identification;
                user.date_of_birth = date_of_birth;
                user.email = email;
                user.phone = phone;
                return usersTable.update(user)
            } else {
                return false
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
        }
    }

    //TODO - UPDATE BILLING ADDRESS

    async changeUserAccountAddress(addressId: string, user_name: string, surname: string, address: string, postalZip: string, city: string, country: string, defaultAddress: boolean, userId: string): Promise<boolean> {
        const addressesTable = this.db.getCollection('addresses')
        try {
            const foundAddresses: AccountUserAddresses[] = addressesTable.find({ userId: parseInt(userId) })
            if (foundAddresses) {
                const addresses = foundAddresses.map(a => {
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
                const filteredAddress = addresses.filter(a => {
                    return a.id.toString() === addressId.toString()
                }).map(a => {
                    a.user_name = user_name
                    return addressesTable.update(filteredAddress)
                })



                /* filteredAddress[0].user_name = user_name;
                filteredAddress[0].surname = surname;
                filteredAddress[0].address = address;
                filteredAddress[0].postalZip = postalZip;
                filteredAddress[0].city = city;
                filteredAddress[0].country = country;
                filteredAddress[0].defaultAddress = defaultAddress;
                filteredAddress[0].id = parseInt(userId);
                return addressesTable.update(filteredAddress) */
            } else {
                return false
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
        }
    }

    async changeUserAccountBillingAddress(id: string, user_name: string, surname: string, address: string, postalZip: string, city: string, country: string, identification: string): Promise<boolean> {
        const usersTable = this.db.getCollection('users')
        try {
            const user: UpdateBillingAddress = usersTable.findOne({ id: parseInt(id) })
            if (user) {
                user.user_name = user_name;
                user.surname = surname;
                user.address = address;
                user.postalZip = postalZip;
                user.city = city;
                user.country = country;
                user.identification = identification
                return usersTable.update(user)
            } else {
                return false
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
        }
    }



}