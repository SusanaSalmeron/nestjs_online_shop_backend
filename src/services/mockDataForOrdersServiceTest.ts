import { ProductCard } from '../classes/productCard';
import { Product } from '../classes/product';

export const mockFindOneAddress = (criteria) => {
    return mockAddressesData.filter(fa => fa.id === criteria["id"])[0]
}

export const mockFindOneUser = (criteria) => {
    return mockUserData.filter(fu => fu.id === criteria["id"])[0]
}

export const mockFindOrders = (criteria) => {
    const orders = mockOrdersData.filter(fo => fo.user_id === criteria["user_id"])
    return orders.length ? orders : null
}

export const mockFindOrdersPosition = (criteria => {
    return mockOrderPositionData.filter(fop => fop.order_id === criteria["order_id"])
})

/* export const findOrdersPosition = (criteria) => {
    const targetOrderId = criteria["order_id"]
    const foundProductsInOrder = mockData[1].fakeOrderPositionTableData.filter(fop => fop.order_id === targetOrderId)
    return foundProductsInOrder
} */
/* export const mockGetCollection = async (addressCol, ordersCol, positionCol, userCol) => {
    return {
        getCollection: jest.fn().mockImplementation((tableName) => {
            const collections = {
                "addresses": addressCol,
                "orderPosition": positionCol,
                "orders": ordersCol,
                "users": userCol
            }
            return collections[tableName]
        })
    }
} */

export const mockFindProdyctsById = async (id) => {
    let products
    {
        products = {
            1: new ProductCard(
                1,
                "Natasha Denona",
                "Biba Palette",
                129,
                "Biba features 15 brand-new shades of Natasha Denona’s signature formulas. It includes neutral, warm, and cool tones, from light to dark, in different textures. This eyeshadow palette is very user-friendly, and covers a shade range that varies from mauves, burgundies, and browns to warm greys and black.",
                "eyeshadow",
                "https://www.sephora.com/productimages/sku/s2192821-main-zoom.jpg?imwidth=1224",
                [
                    {
                        "hex_value": "",
                        "colour_name": "Biba Palette"
                    }
                ]
            ),
            2: new ProductCard(
                2,
                "Natasha Denona",
                "Mini Bronze Palette",
                27,
                "This mini palette is inspired by Natasha Denona’s bestselling Bronze Eyeshadow Palette and brings together five warm- toned neutrals in creamy matte and metallic finishes perfect for summer or fall.These innovative, easy - to - use formulas offer the high performance and versatility Natasha is known for.This travel - size palette easily takes your look from day to night and allows you to complete a whole look on the go.These shades also wear beautifully on all skin tones.",
                "eyeshadow",
                "https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224",
                [
                    {
                        "hex_value": "",
                        "colour_name": "Mini Bronze Palette"
                    }
                ]
            )
        }
    }
    return products[id]
}

export async function newProducts() {
    return [new ProductCard(
        1,
        "Natasha Denona",
        "Biba Palette",
        129,
        "Biba features 15 brand-new shades of Natasha Denona’s signature formulas. It includes neutral, warm, and cool tones, from light to dark, in different textures. This eyeshadow palette is very user-friendly, and covers a shade range that varies from mauves, burgundies, and browns to warm greys and black.",
        "eyeshadow",
        "https://www.sephora.com/productimages/sku/s2192821-main-zoom.jpg?imwidth=1224",
        [
            {
                "hex_value": "",
                "colour_name": "Biba Palette"
            }
        ]
    ),
    new ProductCard(
        2,
        "Natasha Denona",
        "Mini Bronze Palette",
        27,
        "This mini palette is inspired by Natasha Denona’s bestselling Bronze Eyeshadow Palette and brings together five warm- toned neutrals in creamy matte and metallic finishes perfect for summer or fall.These innovative, easy - to - use formulas offer the high performance and versatility Natasha is known for.This travel - size palette easily takes your look from day to night and allows you to complete a whole look on the go.These shades also wear beautifully on all skin tones.",
        "eyeshadow",
        "https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224",
        [
            {
                "hex_value": "",
                "colour_name": "Mini Bronze Palette"
            }
        ]
    )
    ]
}

export async function productToShow() {
    [new Product(
        1,
        "Natasha Denona",
        "Biba Palette",
        129,
        "https://www.sephora.com/productimages/sku/s2192821-main-zoom.jpg?imwidth=1224",
    ),
    new Product(
        2,
        "Natasha Denona",
        "Mini Bronze palette",
        27,
        "https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224",
    )]
}

const mockAddressesData = [
    {
        "id": 1,
        "user_name": "Peter",
        "surname": "Smith",
        "address": "Gran Via 39",
        "postalZip": "28013",
        "city": "Madrid",
        "country": "Spain",
        "defaultAddress": true,
        "userId": 1000
    },
    {
        "id": 2,
        "user_name": "Peter",
        "surname": "Smith",
        "address": "Fuencarral 39",
        "postalZip": "28004",
        "city": "Madrid",
        "country": "Spain",
        "defaultAddress": false,
        "userId": 1000
    },
    {
        "id": 3,
        "user_name": "Evan",
        "surname": "Pennington",
        "address": "#254-4210 Mi Avenue",
        "postalZip": "86276",
        "city": "Rangiora",
        "country": "Brazil",
        "defaultAddress": true,
        "userId": 971
    }
]

const mockUserData = [
    {
        "id": 1000,
        "user_name": "Peter",
        "surname": "Smith",
        "address": "Gran Via 39",
        "postalZip": "28013",
        "city": "Madrid",
        "country": "Spain",
        "phone": "+63765875543",
        "email": "eu.tellus@outlook.edu",
        "date_of_birth": "18/01/1943",
        "identification": "05022081I",
        "password": "Rwm31Irh7Og!"
    },
    {
        "id": 971,
        "user_name": "Evan",
        "surname": "Pennington",
        "address": "#254-4210 Mi Avenue",
        "postalZip": "86276",
        "city": "Rangiora",
        "country": "Brazil",
        "phone": "+55987446634",
        "email": "ut.molestie.in@icloud.net",
        "date_of_birth": "02/01/1963",
        "identification": "24671636T",
        "password": "WIK74ZWM4CY"
    }
]

const mockOrdersData = [
    {
        "id": 1,
        "user_id": 1000,
        "delivery_address_id": 1,
        "order_date": "17/05/2021",
        "status": "Shipped"
    },
    {
        "id": 2,
        "user_id": 1000,
        "delivery_address_id": 2,
        "order_date": "03/06/2022",
        "status": "In process"
    }
]

const mockOrderPositionData = [
    {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "colour_name": "Biba Palette",
        "units": 1,
        "total": 129
    },
    {
        "id": 2,
        "order_id": 2,
        "product_id": 2,
        "colour_name": "Mini Bronze Palette",
        "units": 1,
        "total": 27
    },

]
