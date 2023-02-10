export const mockFindReviews = (criteria) => {
    if (criteria.userId) {
        return mockReviewData.filter(review => review.userId === criteria["userId"])
    }
    else {
        const products = mockReviewData.filter(review => review.productId === criteria["productId"])
        return products.length ? products : null
    }
}

export const mockFindOneUser = (criteria) => {
    const user = mockUserData.filter(user => user.id === criteria["id"])
    return user.length ? user[0] : null
}


const mockReviewData = [
    {
        "id": 1,
        "productId": 1061,
        "productName": "Pastel Eyeshadow Palette",
        "userId": 1000,
        "rating": 5,
        "comment": "I hardly ever write reviews but I had to for this. I was scared by the price but this is the prettiest palette I have ever bought. I am very fair skinne1 and I just love ever single color. Some are more pigmented than others, but some days I want less pigment so it’s perfect. Highly, highly recommend this!"
    },
    {
        "id": 2,
        "productId": 1062,
        "productName": "Puff Paint Liquid Blush",
        "userId": 1000,
        "rating": 4,
        "comment": "Really beautiful blush, the colour is immaculate, and it’s not insanely pigmented that you feel that you put too much on. Would recommend! Not a lot of product inside though composed to others like Nars Orgasim Liquid Blush."
    },
    {
        "id": 3,
        "productId": 1062,
        "productName": "Puff Paint Liquid Blush",
        "userId": 999,
        "rating": 5,
        "comment": "This is my go to blush for everyday dewy makeup looks. I really like the consistency and the color. And this was my first ever liquid blush purchase and I don’t regret buying it."
    }
]

const mockUserData = [
    {
        "id": 1000,
        "userName": "Joseph",
        "surname": "Hinton",
        "address": "P.O. Box 328, 3703 Et Ave",
        "postalZip": "859181",
        "city": "Canela",
        "country": "Philippines",
        "phone": "+63765875543",
        "email": "eu.tellus@outlook.edu",
        "dateOfBirth": "18/01/1943",
        "identification": "05022081I",
        "password": "Rwm31Irh7Og!"
    },
    {
        "id": 999,
        "userName": "Evan",
        "surname": "Pennington",
        "address": "#254-4210 Mi Avenue",
        "postalZip": "86276",
        "city": "Rangiora",
        "country": "Brazil",
        "phone": "+55987446634",
        "email": "ut.molestie.in@icloud.net",
        "dateOfBirth": "02/01/1963",
        "identification": "24671636T",
        "password": "WIK74ZWM4CY"
    }
]