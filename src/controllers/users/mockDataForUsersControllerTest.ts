import { OrderOverview } from '../../classes/orderOverview'
import { OrderProductsOverview } from '../../classes/orderProductsOverview'
import { Product } from '../../classes/product';
import { LoginUser } from '../../classes/loginUser';
import { AccountUserAddresses } from '../../classes/accountUserAddresses';
import { AccountUserData } from '../../classes/accountUserData';
import { ProductCard } from '../../classes/productCard';
import { UserLoginDto } from '../../dto/userLoginDto';
import { UpdateUserAccountDataDto } from '../../dto/updateUserAccountDataDto';
import { UpdateUserAccountAddressesDto } from '../../dto/updateUserAccountAddressesDto';
import { CreateUserAddressDto } from '../../dto/createUserAddressDto';
import { UpdateBillingAddressDto } from '../../dto/updateBillingAddressDto';
import { Search } from '../../classes/search';



export const mockFindAllBrandsAndNames = () => {
    return [new Search(
        {
            name: 'Natasha Denona',
            value: 'Natasha Denona'
        },
        {
            name: 'Biba Palette',
            value: 'Biba Palette'
        }
    )]
}

export const mockSearchList = () => {
    return [new Product(
        1,
        'Biba Palette',
        'Natasha Denona',
        129,
        'https://www.sephora.com/productimages/sku/s2192821-main-zoom.jpg?imwidth=1224'
    ),
    new Product(
        2,
        'Mini Bronze Palette',
        'Natasha Denona',
        25,
        'https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224'
    ),
    new Product(
        3,
        'Mini Love Palette',
        'Natasha Denona',
        25,
        'https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224'
    )
    ]
}

export const mockFindOrdersBy = () => {
    return [new OrderOverview(
        1,
        'Joseph',
        'Hinton',
        'P.O. Box 328, 3703 Et Ave',
        '859181',
        'Canela',
        'Philippines',
        '01/09/2022',
        'shipped',
        [new OrderProductsOverview(
            'Mini Love Palette',
            'Natasha Denona',
            'Mini Love Palette',
            25,
            1,
            25
        ),
        new OrderProductsOverview(
            'Mini Bronze Palette',
            'Natasha Denona',
            'Mini Bronze Palette',
            25,
            1,
            25
        )
        ],
        50
    ),
    new OrderOverview(
        1,
        'Joseph',
        'Hinton',
        'P.O. Box 328, 3703 Et Ave',
        '859181',
        'Canela',
        'Philippines',
        '01/09/2022',
        'shipped',
        [new OrderProductsOverview(
            'Biba Palette',
            'Natasha Denona',
            'Biba Palette',
            1,
            129,
            129
        )
        ],
        129
    )
    ]
}

export const mockFindOrderBy = () => {
    return (new OrderOverview(
        1,
        'Joseph',
        'Hinton',
        'P.O. Box 328, 3703 Et Ave',
        '859181',
        'Canela',
        'Philippines',
        '01/09/2022',
        'shipped',
        [new OrderProductsOverview(
            'Mini Love Palette',
            'Natasha Denona',
            'Mini Love Palette',
            25,
            1,
            25
        ),
        new OrderProductsOverview(
            'Mini Bronze Palette',
            'Natasha Denona',
            'Mini Bronze Palette',
            25,
            1,
            25
        )
        ],
        50
    ))
}

export const mockFindAllOrdersBy = () => {
    return [new OrderOverview(
        1,
        'Joseph',
        'Hinton',
        'P.O. Box 328, 3703 Et Ave',
        '859181',
        'Canela',
        'Philippines',
        '01/09/2022',
        'shipped',
        [new OrderProductsOverview(
            'Mini Love Palette',
            'Natasha Denona',
            'Mini Love Palette',
            25,
            1,
            25
        ),
        new OrderProductsOverview(
            'Mini Bronze Palette',
            'Natasha Denona',
            'Mini Bronze Palette',
            25,
            1,
            25
        )
        ],
        50
    ),
    new OrderOverview(
        1,
        'Joseph',
        'Hinton',
        'P.O. Box 328, 3703 Et Ave',
        '859181',
        'Canela',
        'Philippines',
        '01/09/2022',
        'shipped',
        [new OrderProductsOverview(
            'Biba Palette',
            'Natasha Denona',
            'Biba Palette',
            1,
            129,
            129
        )
        ],
        129
    )
    ]
}

export const mockFindUserByEmail = () => {
    return new LoginUser(
        1,
        'Joseph',
        'eu.tellus@outlook.edu',
        'Rwm31Irh7Og!'
    )
}

export const mockFindUserById = () => {
    return new AccountUserData(
        1000,
        'Joseph',
        'Hinton',
        'P.O. Box 328, 3703 Et Ave',
        '859181',
        'Canela',
        'Philippines',
        '+63765875543',
        'eu.tellus@outlook.edu',
        '18/01/1943',
        '05022081I',
        'Rwm31Irh7Og!'
    )
}

export const mockFindAddressesBy = () => {
    return [
        new AccountUserAddresses(
            1,
            'Joseph',
            'Hinton',
            'P.O. Box 328, 3703 Et Ave',
            '859181',
            'Canela',
            'Philippines',
            true,
            1
        ),
        new AccountUserAddresses(
            2,
            'Joseph',
            'Hinton',
            'P.O. Box 339,Biba Ave',
            '859185',
            'Canela',
            'Philippines',
            false,
            1
        )
    ]
}

export const mockGetWishlist = () => {
    return [new ProductCard(
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
                'colour_name': 'Biba palette'
            }
        ]
    ),

    new ProductCard(
        2,
        'Natasha Denona',
        'Pastel Palette',
        65,
        'Anything but ordinary, the Pastel Eyeshadow Palette‘s unique color story offers buildable intensity for everything from subtle to statement looks. Go monochrome with the same pastel shade in different tones or use the palette to add a pop of pastel to an otherwise neutral eye—the only limit is your imagination. Whatever you choose all formulas in this palette blend seamlessly for long-lasting, effortless, pro-level looks.',
        'eyeshadow',
        'https://www.sephora.com/productimages/sku/s2512556-main-zoom.jpg?imwidth=1224',
        [
            {
                'hex_value': '',
                'colour_name': 'Pastel Palette'
            }
        ]
    )]
}





export const bodyForUserLogin: UserLoginDto = {
    email: 'mamamama@gmail.com',
    password: 'Abcdef123!'
}

export const bodyForChangeData: UpdateUserAccountDataDto = {
    userName: 'Susana',
    surname: 'Salmeron',
    identification: '1234567A',
    dateOfBirth: '04/05/1976',
    email: 'mamamama@gmail.com',
    phone: '123456789',
}

export const bodyForChangeAddress: UpdateUserAccountAddressesDto = {
    userName: 'Susana',
    surname: 'Salmeron',
    address: 'Fuencarral 9',
    postalZip: '28004',
    city: 'Madrid',
    country: 'Spain',
    defaultAddress: false

}

export const bodyForAddAddress: CreateUserAddressDto = {
    userName: 'Susana',
    surname: 'Salmeron',
    address: 'Fuencarral 9',
    postalZip: '28029',
    city: 'Madrid',
    country: 'Spain',
    defaultAddress: false
}

export const bodyForBillingAddress: UpdateBillingAddressDto = {
    userName: 'Susana',
    surname: 'Salmeron',
    address: 'Fuencarral 9',
    postalZip: '28029',
    city: 'Madrid',
    country: 'Spain',
    identification: '1234567A'
}

export const newResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
    }
}

export const mockOrders = [new OrderOverview(
    1,
    'Peter',
    'Hinton',
    'P.O. Box 328, 3703 Et Ave',
    '859181',
    'Canela',
    'Philippines',
    '01/09/2022',
    'shipped',
    [new OrderProductsOverview(
        'Mini Love Palette',
        'Natasha Denona',
        'Mini Love Palette',
        25,
        1,
        25
    ),
    new OrderProductsOverview(
        'Mini Bronze Palette',
        'Natasha Denona',
        'Mini Bronze Palette',
        25,
        1,
        25
    )
    ],
    50
)]

export const mockOrdersPositions = [
    {
        "id": 2,
        "orderId": 1,
        "productId": 15,
        "productName": "Lippie Pencil",
        "colour_name": "BFF Pencil",
        "units": 1,
        "total": 5.0
    }
]



