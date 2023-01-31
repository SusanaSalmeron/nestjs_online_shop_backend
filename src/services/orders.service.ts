import { Injectable, Logger, Inject } from "@nestjs/common";
import * as loki from 'lokijs';
import { Orders } from "../classes/orders";
import { OrderProductsOverview } from "../classes/orderProductsOverview";
import { OrderOverview } from "../classes/orderOverview";
import { OrderPosition } from "../classes/OrderPosition";
import { AccountUserData } from "../classes/accountUserData";
import { ProductsService } from "./products.service";
import { CreateNewOrderDto } from "src/dto/createNewOrderDto";



@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name)
    private orderId = 7
    private orderPositionId = 13
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
        this.logger.log(`Found products in order ${order.id}`)
        const productsArray = []
        const totalProductArray = []
        for (let i = 0; i < foundProductsInOrder.length; i++) {
            const productsFromApi = await this.productsService.findProductById(foundProductsInOrder[i].productId.toString())
            this.logger.log(`Product with id ${foundProductsInOrder[i].productId} found`)
            const productOverview = new OrderProductsOverview(
                productsFromApi.name,
                productsFromApi.brand,
                foundProductsInOrder[i].colour_name,
                productsFromApi.price,
                foundProductsInOrder[i].units,
                foundProductsInOrder[i].total,
            )
            productsArray.push(productOverview)
            this.logger.log(`Product with id ${foundProductsInOrder[i].productId} pushed in array`)
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
            this.logger.log(`User ${userId} founded`)
            const foundOrders = ordersTable.find({ userId: userId })
            if (foundOrders) {
                for (let i = 0; i < foundOrders.length; i++) {
                    this.logger.log(`Order ${foundOrders[i]} from ${userId} founded`)
                    const order = await this.buildOrderOverview(foundOrders[i])
                    orders.push(order)
                    this.logger.log(`Order ${foundOrders[i].orderId} has been pushed to array}`)
                }
            } else {
                this.logger.log(`The user ${userId} has not order to show`)
                return []
            }
        } else {
            this.logger.error(`The user ${userId} does not exist`)
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
            this.logger.log(`Order ${orderId} found`)
            order = await this.buildOrderOverview(foundOrder)
            this.logger.log(`The Order Overview has been build`)
        }
        return order
    }

    async findAllOrdersBy(status: string, userId: number): Promise<OrderOverview[]> {
        const ordersTable = this.db.getCollection('orders')
        const orders: OrderOverview[] = []
        const foundOrders = ordersTable.find({ userId: userId })
        console.log(foundOrders)
        if (foundOrders) {
            this.logger.log(`Orders from user ${userId} founded successfully`)
            const filteredOrders = foundOrders.filter(order => {
                if (status === "inprocess") {
                    const newStatus = order.status.replace(/\s+/g, '')
                    return newStatus.toUpperCase() === status.toUpperCase()
                } else {
                    return order.status.toUpperCase() === status.toUpperCase()
                }
            })
            this.logger.log('Orders has been filtered by status')
            for (let i = 0; i < filteredOrders.length; i++) {
                const order = await this.buildOrderOverview(filteredOrders[i])
                orders.push(order)
            }
        }
        return orders
    }

    async addNewOrder(userId: number, createNewOrder: CreateNewOrderDto): Promise<number> {
        const ordersTable = this.db.getCollection('orders')
        const orderPositionTable = this.db.getCollection('orderPosition')
        const { name, surname, deliveryAddress, postalZip, city, country, orderDate, status, products } = createNewOrder
        const newOrderId = this.orderId++
        const newOrderPositionId = this.orderPositionId++
        const order = ordersTable.insert(
            {
                id: newOrderId,
                userId: userId,
                name: name,
                surname: surname,
                deliveryAddress: deliveryAddress,
                postalZip: postalZip,
                city: city,
                country: country,
                orderDate: orderDate,
                status: status
            }
        )
        this.logger.log(`order ${order.id} inserted`)
        if (order) {
            products.forEach((product) => {
                orderPositionTable.insert(
                    {
                        id: newOrderPositionId,
                        orderId: newOrderId,
                        productId: product.productId,
                        name: product.productName,
                        product_colors: product.colour_name,
                        units: product.units,
                        total: product.total
                    })
            })
            this.logger.log(`products from order ${newOrderId} inserted`)
            return newOrderId
        } else {
            this.logger.error('order does not exist')
            return null
        }
    }
}