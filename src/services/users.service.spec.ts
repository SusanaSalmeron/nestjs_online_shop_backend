import { Test, TestingModule } from "@nestjs/testing"
import { AccountUserAddresses } from "../classes/accountUserAddresses"
import { AccountUserData } from "../classes/accountUserData"
import { LoginUser } from "../classes/loginUser"
import { Product } from "../classes/product"
import { newProducts, productToShow } from "./mockDataForOrdersServiceTest"
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
                findNewProducts: jest.fn(() => newProducts()),
                findProductsBy: jest.fn(() => productToShow())
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
            providers: [UsersService, Product, productsServiceProvider, dbProvider]
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
        expect(addressesMockDBCollection.findOne).toHaveBeenLastCalledWith({ id: 1 })
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
}) 