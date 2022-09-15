import { Product } from "../../classes/product"
import { ProductCard } from "../../classes/productCard"

export const mockFindProductById = () => {
    return new ProductCard(
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
                "colour_name": "Biba palette"
            }
        ]
    )
}

export const mockFindNewProducts = () => {
    return [new ProductCard(
        2,
        'Natasha Denona',
        'Mini Bronze Palette',
        25,
        'This mini palette is inspired by Natasha Denona’s bestselling Bronze Eyeshadow Palette and brings together five warm-toned neutrals in creamy matte and metallic finishes perfect for summer or fall. These innovative, easy-to-use formulas offer the high performance and versatility Natasha is known for. This travel-size palette easily takes your look from day to night and allows you to complete a whole look on the go. These shades also wear beautifully on all skin tones.',
        'palette',
        "https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224",
        [
            {
                "hex_value": "",
                "colour_name": "Mini Bronze palette"
            }
        ]
    ),
    new ProductCard(
        3,
        'Natasha Denona',
        'Mini Love Palette',
        25,
        'This palette provides maximum color payoff with minimal effort, blending seamlessly to achieve vibrant, ultra-pigmented, long lasting looks. Its compact size is perfect for travelling, allowing you to complete a whole look on the go. ',
        'eyeshadow',
        "https://www.sephora.com/productimages/sku/s2592012-main-zoom.jpg?imwidth=1224",
        [
            {
                "hex_value": "",
                "colour_name": "Mini Bronze palette"
            }
        ]
    )]
}

export const mockFindProductsBy = () => {
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
    ),
    ]
}