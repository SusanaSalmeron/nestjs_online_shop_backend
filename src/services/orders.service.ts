import { Injectable, Logger, Inject } from "@nestjs/common";
import * as loki from 'lokijs';
import { Orders } from "../classes/orders";
import { OrderProductsOverview } from "../classes/orderProductsOverview";
import { OrderOverview } from "../classes/orderOverview";
import { OrderPosition } from "../classes/OrderPosition";
import { AccountUserData } from "src/classes/accountUserData";
import { ProductsService } from "./products.service";





@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name)
    constructor(@Inject('DATABASE_CONNECTION') private db: loki, private productsService: ProductsService) { }


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
            const productsFromApi = await this.productsService.findProductById(foundProductsInOrder[i].product_id.toString())

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

    async findAllOrdersBy(status: string, userId: string): Promise<OrderOverview[]> {
        const ordersTable = this.db.getCollection('orders')
        const usersTable = this.db.getCollection('users')

        const orders: OrderOverview[] = []

        try {
            const foundOrders = ordersTable.find({ user_id: parseInt(userId) })
            const user: AccountUserData = usersTable.findOne({ id: parseInt(userId) })
            if (foundOrders) {
                const filteredOrders = foundOrders.filter(o => {
                    if (status === "inprocess") {
                        const newStatus = o.status.replace(/\s+/g, '')
                        return newStatus.toUpperCase() === status.toUpperCase()
                    } else {
                        return o.status.toUpperCase() === status.toUpperCase()
                    }
                })
                for (let i = 0; i < filteredOrders.length; i++) {
                    const order = await this.buildOrderOverview(filteredOrders[i], user)
                    orders.push(order)
                }
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
        }
        return orders
    }



}