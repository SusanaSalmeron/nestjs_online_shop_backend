import { ProductCard } from '../classes/productCard'
import { Product } from '../classes/product'
import { Review } from '../classes/review'

export const mockFindOneUser = (criteria) => {
    if (criteria.email) {
        return mockUserData.filter(ud => ud.email === criteria['email'])[0]
    }
    else if (criteria.id) {
        return mockUserData.filter(ud => ud.id === criteria['id'])[0]
    }
}

export const mockFindAddresses = (criteria) => {
    const addresses = mockAddresses.filter(a => a.userId === criteria['userId'])
    return addresses.length ? addresses : null
}

export const mockFindOneAddress = (criteria) => {
    return mockAddresses.filter(a => a.id === criteria['id'])[0]
}

export const mockFindWishlist = (criteria) => {
    return mockWishlistData.filter(wd => wd.userId === criteria['userId'])
}

export const mockFindOneProductOnWishlist = (criteria) => {
    const productOnWishlist = mockWishlistData.filter(wd =>
        wd.userId === criteria['userId'] && wd.productId === criteria['productId'])
    return productOnWishlist.length ? productOnWishlist[0] : null
}

export const mockFindUserReviews = (criteria) => {
    const userReviews = mockUserReviews.filter(ur =>
        ur.userId === criteria['userId'])
    return userReviews
}

const mockUserData = [
    {
        'id': 1,
        'userName': 'Joseph',
        'surname': 'Hinton',
        'address': 'P.O. Box 328, 3703 Et Ave',
        'postalZip': '859181',
        'city': 'Canela',
        'country': 'Philippines',
        'phone': '+63765875543',
        'email': 'eu.tellus@outlook.edu',
        'dateOfBirth': '18/01/1943',
        'identification': '05022081I',
        'password': 'Rwm31Irh7Og!'
    },
    {
        'id': 2,
        'userName': 'Evan',
        'surname': 'Pennington',
        'address': '#254-4210 Mi Avenue',
        'postalZip': '86276',
        'city': 'Rangiora',
        'country': 'Brazil',
        'phone': '+55987446634',
        'email': 'ut.molestie.in@icloud.net',
        'dateOfBirth': '02/01/1963',
        'identification': '24671636T',
        'password': 'WIK74ZWM4CY'
    },
]

const mockAddresses = [
    {
        'id': 1,
        'userName': 'Joseph',
        'surname': 'Hinton',
        'address': 'P.O. Box 328, 3703 Et Ave',
        'postalZip': '859181',
        'city': 'Canela',
        'country': 'Philippines',
        'defaultAddress': true,
        'userId': 1
    },
    {
        'id': 2,
        'userName': 'Joseph',
        'surname': 'Hinton',
        'address': 'Ap #939-7227 Biba Avenue',
        'postalZip': '859187',
        'city': 'Canela',
        'country': 'Philippines',
        'defaultAddress': false,
        'userId': 1
    }
]

const mockWishlistData = [
    {
        'id': 1,
        'userId': 1,
        'productId': 1
    },
    {
        'id': 2,
        'userId': 1,
        'productId': 2
    },
    {
        'id': 3,
        'userId': 1,
        'productId': 3
    },
    {
        'id': 4,
        'userId': 1,
        'productId': 4
    },
    {
        'id': 5,
        'userId': 1,
        'productId': 5
    }
]
export const mockUserReviews = [
    {
        'id': 1,
        'productId': 10,
        'userId': 1,
        'rating': 5,
        'comment': 'The eyeshadow’s practically blend themselves, they look amazing! Biba makes me happy every morning when I open my makeup drawer and see her in there. I’m not spending my money on cheaper palettes that are imitation’s of what I want, and that I will hoard and never use. I’m saving up and getting that one expensive palette and this is it!'
    },
    {
        'id': 2,
        'productId': 11,
        'userId': 1,
        'rating': 5,
        'comment': 'This product is a LIFE CHANGER. It blends so well and is so smooth. It creates such a natural look and is incredible. Selena Gomez, keep on doing whatever you are doing because GIRL, this is where it is at!'
    },

]


export const mockFindProdyctsById = async (id) => {
    let products
    {
        products = {
            1: new ProductCard(
                1,
                'Natasha Denona',
                'Biba Palette',
                129,
                'Biba features 15 brand-new shades of Natasha Denona’s signature formulas. It includes neutral, warm, and cool tones, from light to dark, in different textures. This eyeshadow palette is very user-friendly, and covers a shade range that varies from mauves, burgundies, and browns to warm greys and black.',
                'eyeshadow',
                'https://www.sephora.com/productimages/sku/s2192821-main-zoom.jpg?imwidth=1224',
                [
                    {
                        'hex_value': '',
                        'colour_name': 'Biba Palette'
                    }
                ]
            ),
            2: new ProductCard(
                2,
                'Natasha Denona',
                'Mini Bronze Palette',
                27,
                'This mini palette is inspired by Natasha Denona’s bestselling Bronze Eyeshadow Palette and brings together five warm- toned neutrals in creamy matte and metallic finishes perfect for summer or fall.These innovative, easy - to - use formulas offer the high performance and versatility Natasha is known for.This travel - size palette easily takes your look from day to night and allows you to complete a whole look on the go.These shades also wear beautifully on all skin tones.',
                'eyeshadow',
                'https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224',
                [
                    {
                        'hex_value': '',
                        'colour_name': 'Mini Bronze Palette'
                    }
                ]
            ),
            3: new ProductCard(
                3,
                'Rare Beauty',
                'Always an Optimist Soft Radiance Setting Powder',
                22,
                'Super-finely milled and silky to the touch, this powder goes on light and airy to provide sheer, seamless coverage with a subtle but visible radiance and a natural finish. Extend makeup wear, blur the look of pores, and smooth skin’s texture. The custom-designed sifter locks for mess-free storage on the go. ',
                'Foundation',
                'https://www.sephora.com/productimages/sku/s2519080-main-zoom.jpg?imwidth=1224',
                [
                    {
                        'hex_value': '#d19f87',
                        'colour_name': 'Light-Medium'
                    },
                    {
                        'hex_value': '#fae3d7',
                        'colour_name': 'Light'
                    }
                ]
            ),
            4: new ProductCard(
                4,
                'Rare Beauty',
                'Always An Optimist 4-in-1 Prime & Set Mist',
                24,
                'Layer this all-in-one mist under or over makeup for a refreshed complexion. Infused with a botanical blend of lotus, gardenia, and white waterlily to help soothe and calm skin, this bi-phase formula also features niacinamide and sodium hyaluronate for the appearance of plumper, smoother skin. ',
                'Foundation',
                'https://www.sephora.com/productimages/sku/s2362465-main-zoom.jpg?imwidth=1224',
                [
                    {
                        'hex_value': '',
                        'colour_name': 'No colour'
                    }
                ]
            ),
            5: new ProductCard(
                5,
                'Natasha Denona',
                'Hy-Gen Skinglass Energizing & Hydrating Primer Serum',
                48,
                'This primer serum has a moisturizing, lightweight texture that delivers a natural-looking, transparent, glass skin effect. It includes a special peptide that provides energizing effects on the skin. The primer serum comes in a universal shade suitable for every skin tone and can be used before or after makeup application.',
                'Foundation',
                'https://www.sephora.com/productimages/sku/s2569499-main-zoom.jpg?imwidth=1224',
                [
                    {
                        'hex_value': '',
                        'colour_name': 'Serum'
                    }
                ]
            ),
            6: new ProductCard(
                6,
                'Rare Beauty',
                'Perfect Strokes Universal Volumizing Mascara',
                20,
                'Finding the perfect mascara comes down to your lash type, which differs from person to person. This weightless, easy-to-build formula and curvy, multi-length brush are made to give every lash type (fine/sparse, full/thick, straight, and curly) more lift, length, curl, and volume.',
                'Mascara',
                'https://www.sephora.com/productimages/sku/s2474138-main-zoom.jpg?imwidth=1224',
                [
                    {
                        'hex_value': '#101010',
                        'colour_name': 'Black'
                    }
                ]

            )
        }
        return products[id]
    }
}

export async function newProducts() {
    return [new ProductCard(
        3,
        'Rare Beauty',
        'Always an Optimist Soft Radiance Setting Powder',
        22,
        'Super-finely milled and silky to the touch, this powder goes on light and airy to provide sheer, seamless coverage with a subtle but visible radiance and a natural finish. Extend makeup wear, blur the look of pores, and smooth skin’s texture. The custom-designed sifter locks for mess-free storage on the go. ',
        'Foundation',
        'https://www.sephora.com/productimages/sku/s2519080-main-zoom.jpg?imwidth=1224',
        [
            {
                'hex_value': '#d19f87',
                'colour_name': 'Light-Medium'
            },
            {
                'hex_value': '#fae3d7',
                'colour_name': 'Light'
            }
        ]
    ),
    new ProductCard(
        4,
        'Rare Beauty',
        'Always An Optimist 4-in-1 Prime & Set Mist',
        24,
        'Layer this all-in-one mist under or over makeup for a refreshed complexion. Infused with a botanical blend of lotus, gardenia, and white waterlily to help soothe and calm skin, this bi-phase formula also features niacinamide and sodium hyaluronate for the appearance of plumper, smoother skin. ',
        'Foundation',
        'https://www.sephora.com/productimages/sku/s2362465-main-zoom.jpg?imwidth=1224',
        [
            {
                'hex_value': '',
                'colour_name': 'No colour'
            }
        ]
    ),
    new ProductCard(
        5,
        'Natasha Denona',
        'Hy-Gen Skinglass Energizing & Hydrating Primer Serum',
        48,
        'This primer serum has a moisturizing, lightweight texture that delivers a natural-looking, transparent, glass skin effect. It includes a special peptide that provides energizing effects on the skin. The primer serum comes in a universal shade suitable for every skin tone and can be used before or after makeup application.',
        'Foundation',
        'https://www.sephora.com/productimages/sku/s2569499-main-zoom.jpg?imwidth=1224',
        [
            {
                'hex_value': '',
                'colour_name': 'Serum'
            }
        ]
    )
    ]
}

export async function productToShow() {
    [new Product(
        1,
        'Natasha Denona',
        'Biba Palette',
        129,
        'https://www.sephora.com/productimages/sku/s2192821-main-zoom.jpg?imwidth=1224',
    ),
    new Product(
        2,
        'Natasha Denona',
        'Mini Bronze palette',
        27,
        'https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224',
    )]
}

export const newUser = {
    userName: 'Ann',
    surname: 'Smith',
    address: 'Calle Marcelina 32',
    postalZip: '28029',
    city: 'Madrid',
    country: 'Spain',
    defaultAddress: false,
    userId: 1
}


export const newDefaultAddress = {
    userName: 'Ann',
    surname: 'Smith',
    address: 'Calle Fuencarral 39',
    postalZip: '28004',
    city: 'Madrid',
    country: 'Spain',
    defaultAddress: true,
    userId: 1
}

export const addressToDelete = {
    addressId: '1',
    userId: '1'
}

export const nonValidAddressToDelete = {
    addressId: '3',
    userId: '1'
}

export const nonValidAddressAndUserToDelete = {
    addressId: '1',
    userId: '4'
}

export const mockReviews = {
    pending: [],
    created: []
}

export const mockUserExists = (userId) => {
    if (userId === 1) {
        return true
    } else {
        return false
    }
}

export const mockUserReviews2 = [new Review(

    1,
    10,
    'Biba Palette',
    5,
    'The eyeshadow’s practically blend themselves, they look amazing! Biba makes me happy every morning when I open my makeup drawer and see her in there. I’m not spending my money on cheaper palettes that are imitation’s of what I want, and that I will hoard and never use. I’m saving up and getting that one expensive palette and this is it!'
),
new Review(
    2,
    11,
    'Soft Pinch Blush',
    5,
    'This product is a LIFE CHANGER. It blends so well and is so smooth. It creates such a natural look and is incredible. Selena Gomez, keep on doing whatever you are doing because GIRL, this is where it is at!'
)

]



export const mockReview = {
    id: 1,
    productId: 5,
    productName: "Biba palette",
    rating: 5,
    comment: "tfukygilhoñp´ìopiñyuligykfugiloñp´òuylgluhoñp´`ç"
}
