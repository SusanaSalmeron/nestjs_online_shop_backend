
export const existentProductIdsWithoutStock = ["1063", "1064", "1065"]

export const existentProductIdsWithStock = ["1060", "1061", "1062"]

export const mockCheckProductAvailability = (ids) => {
    return existentProductIdsWithStock.includes(ids)
}

export const nonExistentProductIds = ["1", "2", "3"]

export const mockExists = (productId) => {
    return (existentProductIdsWithStock.concat(existentProductIdsWithoutStock)).includes(productId)
}