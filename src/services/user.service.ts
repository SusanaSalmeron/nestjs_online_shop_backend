import { Inject, Injectable, Logger } from "@nestjs/common";
import { LoginUser } from "../classes/loginUser";
import { AccountUserData } from '../classes/accountUserData'
import * as loki from 'lokijs';
import { AccountUserAddresses } from "../classes/accountUserAddresses";
import { encrypt } from '../services/security.service';
import * as bcrypt from 'bcrypt'
import { UpdateBillingAddress } from "../classes/updateBillingAddresses";
import { Orders } from "../classes/orders";
import { OrderProductsOverview } from "../classes/orderProductsOverview";
import { OrderOverview } from "../classes/orderOverview";
import { ProductService } from "./product.service";
import { OrderPosition } from "../classes/OrderPosition";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name)
    constructor(@Inject('DATABASE_CONNECTION') private db: loki, private productService: ProductService) { }


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

    async buildOrderOverview(order: Orders, user: AccountUserData): Promise<OrderOverview> {
        const name = user.user_name
        const surname = user.surname

        const addressesTable = this.db.getCollection('addresses')
        const delivery_address = addressesTable.findOne({ id: order.delivery_address_id })


        const address = delivery_address.address
        const postalZip = delivery_address.postalZip
        const city = delivery_address.city
        const country = delivery_address.country
        const date = order.order_date
        const status = order.status


        const orderPositionTable = this.db.getCollection('orderPosition')
        const foundProductsInOrder: OrderPosition[] = orderPositionTable.find({ order_id: order.id })

        const productsArray = []
        const totalProductArray = []


        for (let i = 0; i < foundProductsInOrder.length; i++) {
            const productsFromApi = await this.productService.findProductById(foundProductsInOrder[i].product_id.toString())

            const productOverview = new OrderProductsOverview(
                productsFromApi.name,
                productsFromApi.brand,
                foundProductsInOrder[i].colour_name,
                productsFromApi.price,
                foundProductsInOrder[i].units,
                foundProductsInOrder[i].total,
            )
            productsArray.push(productOverview)
            totalProductArray.push(foundProductsInOrder[i].total)
        }
        const orderTotal = totalProductArray.reduce(this.sum)

        return new OrderOverview(
            order.id,
            name,
            surname,
            address,
            postalZip,
            city,
            country,
            date,
            status,
            productsArray,
            orderTotal
        )
    }

    private sum(accum, currentValue) {
        return accum + currentValue
    }

    async findOrdersBy(userId: string): Promise<OrderOverview[]> {
        const ordersTable = this.db.getCollection('orders')
        const usersTable = this.db.getCollection('users')

        const orders: OrderOverview[] = []
        try {
            const foundOrders = ordersTable.find({ user_id: parseInt(userId) })
            const user: AccountUserData = usersTable.findOne({ id: parseInt(userId) })

            if (foundOrders) {
                for (let i = 0; i < foundOrders.length; i++) {
                    const order = await this.buildOrderOverview(foundOrders[i], user)
                    orders.push(order)
                }
            } else {
                return null
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
        }
        return orders
    }

    async findOrderBy(userId: string, orderId: string): Promise<OrderOverview> {
        const ordersTable = this.db.getCollection('orders')
        const usersTable = this.db.getCollection('users')

        let order: OrderOverview = null
        try {
            const foundOrder = ordersTable.findOne({ id: parseInt(orderId) })
            const user: AccountUserData = usersTable.findOne({ id: parseInt(userId) })

            if (foundOrder) {
                order = await this.buildOrderOverview(foundOrder, user)
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
        }
        return order
    }


}