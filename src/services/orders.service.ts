import { Injectable, Logger, Inject } from "@nestjs/common";
import * as loki from 'lokijs';
import { Orders } from "../classes/orders";
import { OrderProductsOverview } from "../classes/orderProductsOverview";
import { OrderOverview } from "../classes/orderOverview";
import { OrderPosition } from "../classes/OrderPosition";
import { AccountUserData } from "../classes/accountUserData";
import { ProductsService } from "./products.service";



@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name)
    constructor(@Inject('DATABASE_CONNECTION') private db: loki, private productsService: ProductsService) { }


    async buildOrderOverview(order: Orders): Promise<OrderOverview> {
        const name = order.name
        const surname = order.surname
        const deliveryAddress = order.deliveryAddress
        const postalZip = order.postalZip
        const city = order.city
        const country = order.country
        const date = order.orderDate
        const status = order.status

        const orderPositionTable = this.db.getCollection('orderPosition')
        const foundProductsInOrder: OrderPosition[] = orderPositionTable.find({ orderId: order.id })
        const productsArray = []
        const totalProductArray = []

        for (let i = 0; i < foundProductsInOrder.length; i++) {
            const productsFromApi = await this.productsService.findProductById(foundProductsInOrder[i].productId)
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
            deliveryAddress,
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

    async findOrdersBy(userId: number): Promise<OrderOverview[]> {
        const ordersTable = this.db.getCollection('orders')
        const usersTable = this.db.getCollection('users')
        const orders: OrderOverview[] = []
        const user: AccountUserData = usersTable.findOne({ id: userId })
        if (user) {
            const foundOrders = ordersTable.find({ userId: userId })
            if (foundOrders) {
                for (let i = 0; i < foundOrders.length; i++) {
                    const order = await this.buildOrderOverview(foundOrders[i])
                    orders.push(order)
                }
            } else {
                return []
            }
        } else {
            return null
        }
        return orders.map(o => {
            return new OrderOverview(
                o.orderId,
                o.name,
                o.surname,
                o.address,
                o.postalZip,
                o.city,
                o.country,
                o.orderDate,
                o.status,
                o.products,
                o.totalOrder
            )
        })
    }

    async findOrderBy(userId: number, orderId: number): Promise<OrderOverview> {
        const ordersTable = this.db.getCollection('orders')
        let order: OrderOverview = null

        const foundOrder = ordersTable.findOne({ id: orderId })

        if (foundOrder) {
            order = await this.buildOrderOverview(foundOrder)
        }
        return order
    }

    async findAllOrdersBy(status: string, userId: number): Promise<OrderOverview[]> {
        const ordersTable = this.db.getCollection('orders')
        const orders: OrderOverview[] = []

        const foundOrders = ordersTable.find({ userId: userId })
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
                const order = await this.buildOrderOverview(filteredOrders[i])
                orders.push(order)
            }
        }
        return orders
    }
}