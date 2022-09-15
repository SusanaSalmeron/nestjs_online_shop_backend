import { Test, TestingModule } from '@nestjs/testing'
import { Search } from '../../classes/search'
import { AccountUserAddresses } from '../../classes/accountUserAddresses'
import { AccountUserData } from '../../classes/accountUserData'
import { OrdersService } from '../../services/orders.service'
import { ProductsService } from '../../services/products.service'
import { SearchService } from '../../services/search.service'
import { TokenService } from '../../services/token.service'
import { UsersService } from '../../services/users.service'
import { WishlistService } from '../../services/wishlist.service'
import { bodyForAddAddress, bodyForBillingAddress, bodyForChangeAddress, bodyForChangeData, bodyForUserLogin, mockFindAddressesBy, mockFindAllBrandsAndNames, mockFindAllOrdersBy, mockFindOrderBy, mockFindOrdersBy, mockFindUserByEmail, mockFindUserById, mockGetWishlist, mockSearchList, newResponse } from './mockDataForUsersControllerTest'
import { UsersController } from './users.controller'
import { OrderProductsOverview } from '../../classes/orderProductsOverview'
import { OrderOverview } from '../../classes/orderOverview'


describe('UsersController Unit Test', () => {
    let usersController: UsersController
    let spyUsersService: UsersService
    let spyTokenService: TokenService
    let spySearchService: SearchService
    let spyOrdersService: OrdersService
    let spyProductsService: ProductsService
    let spyWishlistService: WishlistService

    const response = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    beforeEach(async () => {
        const usersServiceProvider = {
            provide: UsersService,
            useFactory: () => ({
                findUserByEmail: jest.fn(mockFindUserByEmail),
                findUserById: jest.fn(mockFindUserById),
                changeUserAccountData: jest.fn(() => true),
                findAddressesBy: jest.fn(mockFindAddressesBy),
                changeUserAccountAddress: jest.fn(() => true),
                deleteAddress: jest.fn(() => true),
                addNewShippingAddress: jest.fn(() => 32),
                changeUserAccountBillingAddress: jest.fn(() => true),
                changeUserAccountPassword: jest.fn(() => true),
                getWishlist: jest.fn(mockGetWishlist),
                addProductFromUserWishlist: jest.fn(() => 13),
                deleteProductFromUserWishlist: jest.fn(() => true),
            })
        }

        const tokenServiceProvider = {
            provide: TokenService,
            useFactory: () => ({
                createToken: jest.fn()
            })
        }

        const searchServiceProvider = {
            provide: SearchService,
            useFactory: () => ({
                findAllBrandsAndNames: jest.fn(mockFindAllBrandsAndNames),
                searchList: jest.fn(mockSearchList)
            })
        }

        const ordersServiceProvider = {
            provide: OrdersService,
            useFactory: () => ({
                findOrdersBy: jest.fn(mockFindOrdersBy),
                findOrderBy: jest.fn(mockFindOrderBy),
                findAllOrdersBy: jest.fn(mockFindAllOrdersBy)
            })
        }

        const productsServiceProvider = {
            provide: ProductsService,
            useFactory: () => ({
                exists: jest.fn(() => true)
            })
        }

        const wishlistServiceProvider = {
            provide: WishlistService,
            useFactory: () => ({
                findProductOnWishlist: jest.fn(() => true)
            })
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, TokenService, SearchService, OrdersService, ProductsService, WishlistService, usersServiceProvider, tokenServiceProvider, searchServiceProvider, ordersServiceProvider, productsServiceProvider, wishlistServiceProvider]
        }).compile()

        usersController = module.get<UsersController>(UsersController)
        spyUsersService = module.get<UsersService>(UsersService)
        spyTokenService = module.get<TokenService>(TokenService)
        spySearchService = module.get<SearchService>(SearchService)
        spyOrdersService = module.get<OrdersService>(OrdersService)
        spyProductsService = module.get<ProductsService>(ProductsService)
        spyUsersService = module.get<UsersService>(UsersService)
    })

    /* it('should returns an user when findUserByEmail is called', async () => {
        await usersController.userLogin(response, {
            email: 'mamamama@gmail.com',
            password: 'Abcdef123!'
        })
        expect(spyUsersService.findUserByEmail).toHaveBeenCalled()
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith()
    })
 */
    it('should returns user data when findUserById is called', async () => {
        const mockResponse = newResponse()
        await usersController.userAccountData(1, mockResponse)
        expect(spyUsersService.findUserById).toHaveBeenCalledWith(1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(new AccountUserData(
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
        ))
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns true when user change data', async () => {
        const mockResponse = newResponse()
        await usersController.updateUserAccountData(1, mockResponse, bodyForChangeData)
        expect(spyUsersService.changeUserAccountData).toHaveBeenCalledWith(1, 'Susana', 'Salmeron', '1234567A', '04/05/1976', 'mamamama@gmail.com', '123456789')
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(true)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns an array of addresses', async () => {
        const mockResponse = newResponse()
        await usersController.userAccountAdresses(1, mockResponse)
        expect(spyUsersService.findAddressesBy).toHaveBeenCalledWith(1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith([
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
        ])
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns true when user change account address', async () => {
        const mockResponse = newResponse()
        await usersController.updateUserAccountAddresses(1, 1, mockResponse, bodyForChangeAddress)
        expect(spyUsersService.changeUserAccountAddress).toHaveBeenCalledWith(1, 'Susana', 'Salmeron', 'Fuencarral 9', '28004', 'Madrid', 'Spain', false, 1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(true)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns status code 200 when user delete an address', async () => {
        const mockResponse = newResponse()
        await usersController.deleteAddress({ addressId: "1", userId: "1" }, mockResponse)
        expect(spyUsersService.deleteAddress).toHaveBeenCalledWith({ addressId: "1", userId: "1" })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalled()
    })

    it('should return new addressId when user add a new address', async () => {
        const mockResponse = newResponse()
        await usersController.addUserAccountAddress(1, mockResponse, bodyForAddAddress)
        expect(spyUsersService.addNewShippingAddress).toHaveBeenCalledWith(1, { user_name: 'Susana', surname: 'Salmeron', address: 'Fuencarral 9', postalZip: '28029', city: 'Madrid', country: 'Spain', defaultAddress: false })
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.json).toHaveBeenCalledWith(32)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('return true when user change billing address', async () => {
        const mockResponse = newResponse()
        await usersController.updateUserAccountBillingAddress(1, mockResponse, bodyForBillingAddress)
        expect(spyUsersService.changeUserAccountBillingAddress).toHaveBeenCalledWith(1, 'Susana', 'Salmeron', 'Fuencarral 9', '28029', 'Madrid', 'Spain', '1234567A')
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(true)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns brands and names from all products', async () => {
        const mockResponse = newResponse()
        await usersController.userSearch(mockResponse)
        expect(spySearchService.findAllBrandsAndNames).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith([new Search(
            {
                name: 'Natasha Denona',
                value: 'Natasha Denona'
            },
            {
                name: 'Biba Palette',
                value: 'Biba Palette'
            }
        )])
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns true when user change the password', async () => {
        const mockResponse = newResponse()
        await usersController.updateUserAccountPassword(1, mockResponse, { password: 'Abcdef123!', newPassword: 'Zxcvbn098!', repeatNew: 'Zxcvbn098!' })
        expect(spyUsersService.changeUserAccountPassword).toHaveBeenCalledWith(1, 'Abcdef123!', 'Zxcvbn098!', 'Zxcvbn098!')
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(true)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns all orders from user', async () => {
        const mockResponse = newResponse()
        await usersController.userOrders(1, mockResponse)
        expect(spyOrdersService.findOrdersBy).toHaveBeenCalledWith(1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith([new OrderOverview(
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
        ])
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns one order from user', async () => {
        const mockResponse = newResponse()
        await usersController.userOrder(1, 1, mockResponse)
        expect(spyOrdersService.findOrderBy).toHaveBeenCalledWith(1, 1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith((new OrderOverview(
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
        )))
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns all orders from user by status', async () => {
        const mockResponse = newResponse()
        await usersController.userOrdersByStatus(1, 'shipped', mockResponse)
        expect(spyOrdersService.findAllOrdersBy).toHaveBeenCalledWith('shipped', 1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith([new OrderOverview(
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
        ])
        expect(mockResponse.send).not.toHaveBeenCalled()
    })


})