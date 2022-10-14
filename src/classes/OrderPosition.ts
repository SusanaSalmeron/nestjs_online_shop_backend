export class OrderPosition {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    colour_name: string;
    units: number;
    total: number;


    constructor(id, order_id, product_id, product_name, colour_name, units, total) {
        this.id = id;
        this.order_id = order_id;
        this.product_id = product_id
        this.product_name = product_name
        this.colour_name = colour_name;
        this.units = units;
        this.total = total
    }
}