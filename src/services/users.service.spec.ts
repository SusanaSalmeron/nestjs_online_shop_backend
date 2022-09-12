import { Test, TestingModule } from "@nestjs/testing"
import { AccountUserAddresses } from "../classes/accountUserAddresses"
import { AccountUserData } from "../classes/accountUserData"
import { LoginUser } from "../classes/loginUser"
import { ProductCard } from "../classes/productCard";
import { newProducts, productToShow } from "./mockDataForOrdersServiceTest";
import { addressToDelete, nonValidAddressToDelete, nonValidAddressAndUserToDelete, mockFindAddresses, mockFindOneAddress, mockFindOneProductOnWishlist, mockFindOneUser, mockFindProdyctsById, mockFindWishlist, newUser } from "./mockDataForUsersServiceTest"
import { ProductsService } from "./products.service"
import { UsersService } from "./users.service";
import * as bcrypt from 'bcrypt';


jest.mock('bcrypt')


describe('UsersService', () => {
    let usersService: UsersService
    let spyProductService: ProductsService

    let usersMockDBCollection
    let addressesMockDBCollection
    let wishlistMockDBCollection

    beforeEach(async () => {
        const productsServiceProvider = {
            provide: ProductsService,
            useFactory: () => ({
                findProductById: jest.fn(mockFindProdyctsById),
                findNewProducts: jest.fn(newProducts),
                findProductsBy: jest.fn(productToShow)
            })
        }

        usersMockDBCollection = {
            findOne: jest.fn().mockImplementation(mockFindOneUser),
            update: jest.fn()
        }

        addressesMockDBCollection = {
            find: jest.fn().mockImplementation(mockFindAddresses),
            insert: jest.fn(),
            findOne: jest.fn().mockImplementation(mockFindOneAddress),
            remove: jest.fn()
        }

        wishlistMockDBCollection = {
            find: jest.fn().mockImplementation(mockFindWishlist),
            findOne: jest.fn().mockImplementation(mockFindOneProductOnWishlist),
            insert: jest.fn(),
            remove: jest.fn()
        }

        const dbProvider = {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                return {
                    getCollection: jest.fn().mockImplementation((tableName) => {
                        const collections = {
                            "users": usersMockDBCollection,
                            "addresses": addressesMockDBCollection,
                            "wishlist": wishlistMockDBCollection
                        }
                        return collections[tableName]
                    })
                }
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, productsServiceProvider, dbProvider]
        }).compile()

        usersService = module.get<UsersService>(UsersService)
        spyProductService = module.get<ProductsService>(ProductsService)
    })

    it('should return an user when user exists', async () => {
        const userId = await usersService.findUserByEmail("eu.tellus@outlook.edu")
        expect(userId).toEqual(new LoginUser(
            1,
            'Joseph',
            'eu.tellus@outlook.edu',
            'Rwm31Irh7Og!'
        ))
        expect(usersMockDBCollection.findOne).toHaveBeenCalledWith({ email: "eu.tellus@outlook.edu" })
    })

    it('should return null when user does not exists', async () => {
        const userId = await usersService.findUserByEmail("mamamam@gmail.com")
        expect(userId).toBeNull()
        expect(usersMockDBCollection.findOne).toHaveBeenCalledWith({ email: 'mamamam@gmail.com' })
    })

    it('should return a user with a valid user id', async () => {
        const user = await usersService.findUserById(1)
        expect(user).toEqual(new AccountUserData(
            1,
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
        ))
        expect(usersMockDBCollection.findOne).toHaveBeenCalledWith({ id: 1 })
    })

    it('should return null when user id is not valid', async () => {
        const user = await usersService.findUserById(3)
        expect(user).toBeNull()
        expect(usersMockDBCollection.findOne).toHaveBeenCalledWith({ id: 3 })
    })

    it('should return addresses from a valid user', async () => {
        const addresses = await usersService.findAddressesBy(1)
        expect(addresses).toEqual([new AccountUserAddresses(
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
            'Ap #939-7227 Biba Avenue',
            '859187',
            'Canela',
            'Philippines',
            false,
            1
        )])
        expect(addressesMockDBCollection.find).toHaveBeenCalledWith({ userId: 1 })
    })

    it('should return null when user has not addresses', async () => {
        const addresses = await usersService.findAddressesBy(2)
        expect(addresses).toBeNull()
        expect(addressesMockDBCollection.find).toHaveBeenCalledWith({ userId: 2 })

    })

    it('should add a new shipping address to a valid user', async () => {
        const newAddressId = await usersService.addNewShippingAddress(1, newUser)
        expect(newAddressId).toEqual(32)
        expect(addressesMockDBCollection.insert).toHaveBeenLastCalledWith({
            user_name: "Ann",
            surname: "Smith",
            address: "Calle Marcelina 32",
            postalZip: "28029",
            city: "Madrid",
            country: "Spain",
            defaultAddress: false,
            userId: 1,
            id: 32
        })
        expect(usersService.exists(1)).toBeTruthy()

    })

    it('should return null when the user is not valid', async () => {
        const newAddressId = await usersService.addNewShippingAddress(3, newUser)
        expect(newAddressId).toBeNull()
        expect(await usersService.exists(3)).toBeFalsy()
        expect(addressesMockDBCollection.insert).not.toHaveBeenCalled()
    })

    it('should  return true when try to delete a valid address from a valid user', async () => {
        const deleteAddress = await usersService.deleteAddress(addressToDelete)
        expect(deleteAddress).toBeTruthy()
        expect(addressesMockDBCollection.findOne).toHaveBeenCalledWith({ id: 1 })
        expect(addressesMockDBCollection.remove).toHaveBeenCalledWith({
            id: 1,
            userId: 1,
            user_name: "Joseph",
            surname: "Hinton",
            address: "P.O. Box 328, 3703 Et Ave",
            city: "Canela",
            country: "Philippines",
            defaultAddress: true,
            postalZip: "859181"
        })
    })

    it('should return false when try to delete a non valid address from a valid user', async () => {
        const deleteAddress = await usersService.deleteAddress(nonValidAddressToDelete)
        expect(deleteAddress).toBeFalsy()
        expect(addressesMockDBCollection.findOne).toHaveBeenLastCalledWith({ id: 3 })
        expect(addressesMockDBCollection.remove).not.toHaveBeenCalled()
    })

    it('should return false when try to delete a non valid address from a non valid user', async () => {
        const deleteAddress = await usersService.deleteAddress(nonValidAddressAndUserToDelete)
        expect(deleteAddress).toBeFalsy()
        expect(addressesMockDBCollection.findOne).toHaveBeenLastCalledWith({ id: 1 })
        expect(addressesMockDBCollection.remove).not.toHaveBeenCalled()
    })

    /* it('should change the valid password from a valid user', async () => {
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))
        
        const passwordChange = await usersService.changeUserAccountPassword(1, "Rwm31Irh7Og!", "Mamama9933!", "Mamama9933!")
        console.log(passwordChange)

    })
 */

    it('should return undefined when user data has change from a valid user', async () => {
        const userDataChange = await usersService.changeUserAccountData(1, "Susana", "Salmeron", "1234567T", "04/05/1976", "mmmm@gmail.com", "+34123456789")
        expect(userDataChange).toBeUndefined()
        expect(usersMockDBCollection.findOne).toHaveBeenCalledWith({ id: 1 })
    })

    it('should return undefined when user data has change from a non valid user', async () => {
        const userDataChange = await usersService.changeUserAccountData(7, "Susana", "Salmeron", "1234567T", "04/05/1976", "mmmm@gmail.com", "+34123456789")
        expect(userDataChange).toBeFalsy()
        expect(usersMockDBCollection.findOne).toHaveBeenCalledWith({ id: 7 })
    })

    /* 
        it('should return true when user address has change from a valid user', async () => {
            const addressChanged = await usersService.changeUserAccountAddress(1, "Susana", "Salmeron", "Marcelina 32", "28029", "Madrid", "Spain", false, 1)
            console.log(addressChanged)
        }) */

    it('should return wishlist from a valid user', async () => {
        const wishlist = await usersService.getWishlist(1)
        expect(wishlist).toHaveLength(5)
        expect(wishlist).toEqual([
            new ProductCard(
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
            ),
            new ProductCard(
                3,
                "Rare Beauty",
                "Always an Optimist Soft Radiance Setting Powder",
                22,
                "Super-finely milled and silky to the touch, this powder goes on light and airy to provide sheer, seamless coverage with a subtle but visible radiance and a natural finish. Extend makeup wear, blur the look of pores, and smooth skin’s texture. The custom-designed sifter locks for mess-free storage on the go. ",
                "Foundation",
                "https://www.sephora.com/productimages/sku/s2519080-main-zoom.jpg?imwidth=1224",
                [
                    {
                        "hex_value": "#d19f87",
                        "colour_name": "Light-Medium"
                    },
                    {
                        "hex_value": "#fae3d7",
                        "colour_name": "Light"
                    }
                ]
            ),
            new ProductCard(
                4,
                "Rare Beauty",
                "Always An Optimist 4-in-1 Prime & Set Mist",
                24,
                "Layer this all-in-one mist under or over makeup for a refreshed complexion. Infused with a botanical blend of lotus, gardenia, and white waterlily to help soothe and calm skin, this bi-phase formula also features niacinamide and sodium hyaluronate for the appearance of plumper, smoother skin. ",
                "Foundation",
                "https://www.sephora.com/productimages/sku/s2362465-main-zoom.jpg?imwidth=1224",
                [
                    {
                        "hex_value": "",
                        "colour_name": "No colour"
                    }
                ]
            ),
            new ProductCard(
                5,
                "Natasha Denona",
                "Hy-Gen Skinglass Energizing & Hydrating Primer Serum",
                48,
                "This primer serum has a moisturizing, lightweight texture that delivers a natural-looking, transparent, glass skin effect. It includes a special peptide that provides energizing effects on the skin. The primer serum comes in a universal shade suitable for every skin tone and can be used before or after makeup application.",
                "Foundation",
                "https://www.sephora.com/productimages/sku/s2569499-main-zoom.jpg?imwidth=1224",
                [
                    {
                        "hex_value": "",
                        "colour_name": "Serum"
                    }
                ]
            )
        ])
        expect(wishlistMockDBCollection.find).toHaveBeenCalledWith({ userId: 1 })
        expect(spyProductService.findProductById).toHaveBeenCalled()
    })
    it('should return an empty array when user has no wishlist', async () => {
        const wishlist = await usersService.getWishlist(2)
        expect(wishlist).toHaveLength(0)
        expect(wishlistMockDBCollection.find).toHaveBeenCalledWith({ userId: 2 })
        expect(spyProductService.findProductById).not.toHaveBeenCalled()
    })

    it('should return true when user add a product to wishlist', async () => {
        const productAdded = await usersService.addProductFromUserWishlist(1, 6)
        expect(productAdded).toBeTruthy()
        expect(wishlistMockDBCollection.findOne).toHaveBeenCalledWith({ userId: 1, productId: 6 })
        expect(wishlistMockDBCollection.insert).toHaveBeenCalledWith({
            id: 13,
            userId: 1,
            productId: 6
        })
    })

    it('should return false when user try to add a repeat product to wishlist', async () => {
        const productAdded = await usersService.addProductFromUserWishlist(1, 5)
        expect(productAdded).toBeFalsy()
        expect(wishlistMockDBCollection.findOne).toHaveBeenCalledWith({ userId: 1, productId: 5 })
        expect(wishlistMockDBCollection.insert).not.toHaveBeenCalled()
    })

    it('should return true when user delete a product from the wishlist', async () => {
        const productDeleted = await usersService.deleteProductFromUserWishlist(1, 1)
        expect(productDeleted).toBeTruthy()
        expect(wishlistMockDBCollection.findOne).toHaveBeenCalledWith({ userId: 1, productId: 1 })
        expect(wishlistMockDBCollection.remove).toHaveBeenCalledWith(
            {
                id: 1,
                userId: 1,
                productId: 1
            }
        )
    })

    it('should return false when user try to delete a product that does not exists from the wishtlist', async () => {
        const productDeleted = await usersService.deleteProductFromUserWishlist(1, 6)
        expect(productDeleted).toBeFalsy()
        expect(wishlistMockDBCollection.findOne).toHaveBeenCalledWith({ userId: 1, productId: 6 })
        expect(wishlistMockDBCollection.remove).not.toHaveBeenCalled()
    })

    it('should return true when the user exists', async () => {
        const exists = await usersService.exists(1)
        expect(exists).toBeTruthy()
    })

    it('should return false when the user does not exists', async () => {
        const exists = await usersService.exists(6)
        expect(exists).toBeFalsy()
    })
}) 
