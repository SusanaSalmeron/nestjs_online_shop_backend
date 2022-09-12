export const mockFindOneProductOnWishlist = (criteria) => {
    const productOnWishlist = mockWishlistData.filter(wd => wd.userId === criteria['userId'] && wd.productId === criteria['productId'])
    return productOnWishlist ? productOnWishlist[0] : null
}


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
    }
]