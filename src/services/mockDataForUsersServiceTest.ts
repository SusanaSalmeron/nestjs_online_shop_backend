import { ProductCard } from "../classes/productCard"
import { Product } from "../classes/product"

export const mockFindOneUser = (criteria) => {
    if (criteria.email) {
        return mockUserData.filter(ud => ud.email === criteria['email'])[0]
    }
    else if (criteria.id) {
        return mockUserData.filter(ud => ud.id === criteria["id"])[0]
    }
}

export const mockFindAddresses = (criteria) => {
    const addresses = mockAddresses.filter(a => a.userId === criteria['userId'])
    return addresses.length ? addresses : null
}

export const mockFindOneAddress = (criteria) => {
    return mockAddresses.filter(a => a.id === criteria['id'])[0]
    /* if (criteria === "userId" && criteria === "id") {
        const hola = mockAddresses.filter(a => a.userId === criteria['userId'] && a.id === criteria['id'])[0]
        console.log(hola)
        return hola
    }
    if (criteria === "id") {
        return mockAddresses.filter(a => a.id === criteria['id'])
    } */

}

export const mockFindWishlist = (criteria) => {
    return mockWishlistData.filter(wd => wd.userId === criteria['userId'])
}

export const mockFindOneProductOnWishlist = (criteria) => {
    return mockWishlistData.filter(wd => wd.
        userId === criteria['userId'] && wd.productId === criteria['productId'][0])
}



const mockUserData = [
    {
        "id": 1,
        "user_name": "Joseph",
        "surname": "Hinton",
        "address": "P.O. Box 328, 3703 Et Ave",
        "postalZip": "859181",
        "city": "Canela",
        "country": "Philippines",
        "phone": "+63765875543",
        "email": "eu.tellus@outlook.edu",
        "date_of_birth": "18/01/1943",
        "identification": "05022081I",
        "password": "Rwm31Irh7Og!"
    },
    {
        "id": 2,
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
    },
]

const mockAddresses = [
    {
        "id": 1,
        "user_name": "Joseph",
        "surname": "Hinton",
        "address": "P.O. Box 328, 3703 Et Ave",
        "postalZip": "859181",
        "city": "Canela",
        "country": "Philippines",
        "defaultAddress": true,
        "userId": 1
    },
    {
        "id": 2,
        "user_name": "Joseph",
        "surname": "Hinton",
        "address": "Ap #939-7227 Biba Avenue",
        "postalZip": "859187",
        "city": "Canela",
        "country": "Philippines",
        "defaultAddress": false,
        "userId": 1
    }
]

const mockWishlistData = [
    {
        "id": 1,
        "userId": 1,
        "productId": 1
    },
    {
        "id": 2,
        "userId": 1,
        "productId": 2
    },
    {
        "id": 3,
        "userId": 1,
        "productId": 3
    },
    {
        "id": 4,
        "userId": 1,
        "productId": 4
    },
    {
        "id": 5,
        "userId": 1,
        "productId": 5
    }
]

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

export const newUser = {
    user_name: "Ann",
    surname: "Smith",
    address: "Calle Marcelina 32",
    postalZip: "28029",
    city: "Madrid",
    country: "Spain",
    defaultAddress: false,
    userId: 1
}

export const addressToDelete = {
    addressId: "1",
    userId: "1"
}

export const nonValidAddressToDelete = {
    addressId: "3",
    userId: "1"
}

export const nonValidAddressAndUserToDelete = {
    addressId: "1",
    userId: "4"
}
