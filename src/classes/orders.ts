export class Orders {
    id: number;
    user_id: number;
    delivery_address_id: number;
    order_date: string;
    status: string;


    constructor(id, user_id, delivery_address_id, order_date, status) {
        this.id = id;
        this.user_id = user_id;
        this.delivery_address_id = delivery_address_id;
        this.order_date = order_date;
        this.status = status;
    }
}