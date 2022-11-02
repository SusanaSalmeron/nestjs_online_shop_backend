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
import { ProductCard } from '../../classes/productCard';
import * as bcrypt from 'bcrypt'
import { ReviewsService } from '../../services/review.service'
import { mockReview, mockReviews } from '../../services/mockDataForUsersServiceTest'
import { ValidationService } from '../../services/validation.service'


describe('UsersController Unit Test', () => {
    let usersController: UsersController
    let spyUsersService: UsersService
    let spyTokenService: TokenService
    let spySearchService: SearchService
    let spyOrdersService: OrdersService
    let spyProductsService: ProductsService
    let spyWishlistService: WishlistService
    let spyReviewsService: ReviewsService
    let spyValidationService: ValidationService

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
                addProductFromUserWishlist: jest.fn(() => true),
                deleteProductFromUserWishlist: jest.fn(() => true),
                exists: jest.fn(() => true),
                addNewReview: jest.fn(() => 11),
                findUserReviews: jest.fn(() => mockReviews),
                findReviewBy: jest.fn(() => mockReview),
                updateUserReview: jest.fn(() => true),
                addNewUser: jest.fn(() => 100),
                emailExistsOnDB: jest.fn(() => false)
            })
        }

        const tokenServiceProvider = {
            provide: TokenService,
            useFactory: () => ({
                createToken: jest.fn((): string => 'fdsghjklgjfhdgsfjdgfkh')
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
                findProductOnWishlist: jest.fn(() => false)
            })
        }

        const reviewsServiceProvider = {
            provide: ReviewsService,
            useFactory: () => ({
                existsReviewFromUser: jest.fn(() => false)
            })
        }

        const validationServiceProvider = {
            provide: ValidationService,
            useFactory: () => ({
                validateEmail: jest.fn(() => true)
            })
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, TokenService, SearchService, OrdersService, ProductsService, WishlistService, ReviewsService, ValidationService, usersServiceProvider, tokenServiceProvider, searchServiceProvider, ordersServiceProvider, productsServiceProvider, wishlistServiceProvider, reviewsServiceProvider, validationServiceProvider]
        }).compile()

        usersController = module.get<UsersController>(UsersController)
        spyUsersService = module.get<UsersService>(UsersService)
        spyTokenService = module.get<TokenService>(TokenService)
        spySearchService = module.get<SearchService>(SearchService)
        spyOrdersService = module.get<OrdersService>(OrdersService)
        spyProductsService = module.get<ProductsService>(ProductsService)
        spyWishlistService = module.get<WishlistService>(WishlistService)
        spyReviewsService = module.get<ReviewsService>(ReviewsService)
        spyValidationService = module.get<ValidationService>(ValidationService)
    })
    it('should returns an user when findUserByEmail is called', async () => {
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))
        const mockResponse = newResponse()
        await usersController.userLogin(mockResponse, bodyForUserLogin)
        expect(spyUsersService.findUserByEmail).toHaveBeenCalledWith('mamamama@gmail.com')
        expect(spyTokenService.createToken).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, name: 'Joseph', token: 'fdsghjklgjfhdgsfjdgfkh' })
    })

    it('should returns unauthorized error when user does not exists', async () => {
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false))
        const mockResponse = newResponse()
        await usersController.userLogin(mockResponse, {
            email: 'lalalala@gmail.com',
            password: 'Abcdef123!'
        })
        expect(spyUsersService.findUserByEmail).toHaveBeenCalledWith('lalalala@gmail.com')
        expect(spyTokenService.createToken).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(401)
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Password or/and email error' })
    })

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

    it('should returns true when changeUserAccountData is called', async () => {
        const mockResponse = newResponse()
        await usersController.updateUserAccountData(1, mockResponse, bodyForChangeData)
        expect(spyUsersService.changeUserAccountData).toHaveBeenCalledWith(1, 'Susana', 'Salmeron', '1234567A', '04/05/1976', 'mamamama@gmail.com', '123456789')
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(true)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns an array of addresses when findAddresses is called', async () => {
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

    it('should returns true when changeUserAccountAddresses is called', async () => {
        const mockResponse = newResponse()
        await usersController.updateUserAccountAddresses(1, 1, mockResponse, bodyForChangeAddress)
        expect(spyUsersService.changeUserAccountAddress).toHaveBeenCalledWith(1, 'Susana', 'Salmeron', 'Fuencarral 9', '28004', 'Madrid', 'Spain', false, 1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(true)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns status code 200 when deleteAddress is called', async () => {
        const mockResponse = newResponse()
        await usersController.deleteAddress({ addressId: '1', userId: '1' }, mockResponse)
        expect(spyUsersService.deleteAddress).toHaveBeenCalledWith({ addressId: '1', userId: '1' })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalled()
    })

    it('should return new addressId when addNewShippingAddress is called', async () => {
        const mockResponse = newResponse()
        await usersController.addUserAccountAddress(1, mockResponse, bodyForAddAddress)
        expect(spyUsersService.addNewShippingAddress).toHaveBeenCalledWith(1, { userName: 'Susana', surname: 'Salmeron', address: 'Fuencarral 9', postalZip: '28029', city: 'Madrid', country: 'Spain', defaultAddress: false })
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.json).toHaveBeenCalledWith(32)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('return true when changeUserAccountBillingAddress is called', async () => {
        const mockResponse = newResponse()
        await usersController.updateUserAccountBillingAddress(1, mockResponse, bodyForBillingAddress)
        expect(spyUsersService.changeUserAccountBillingAddress).toHaveBeenCalledWith(1, 'Susana', 'Salmeron', 'Fuencarral 9', '28029', 'Madrid', 'Spain', '1234567A')
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(true)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns brands and names from all products when findAllBrandsAndNames is called', async () => {
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

    it('should returns true when changeUserAccountPassword is called', async () => {
        const mockResponse = newResponse()
        await usersController.updateUserAccountPassword(1, mockResponse, { password: 'Abcdef123!', newPassword: 'Zxcvbn098!', repeatNew: 'Zxcvbn098!' })
        expect(spyUsersService.changeUserAccountPassword).toHaveBeenCalledWith(1, 'Abcdef123!', 'Zxcvbn098!', 'Zxcvbn098!')
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith(true)
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should returns all orders when findOrdersBy is called', async () => {
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

    it('should returns one order when findOrderBy is called', async () => {
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

    it('should returns all orders by status when userOrdersByStatus is called', async () => {
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

    it('should return false when checkProductOnWishlist is called', async () => {
        const mockResponse = newResponse()
        await usersController.checkProductOnWishlist(1, "1", mockResponse)
        expect(spyWishlistService.findProductOnWishlist).toHaveBeenCalledWith(1, 1)
        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalledWith()
    })

    it('should return wishlist when getWishtlist is called', async () => {
        const mockResponse = newResponse()
        await usersController.findUserWishlist(1, mockResponse)
        expect(spyUsersService.getWishlist).toHaveBeenCalledWith(1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith([new ProductCard(
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
        )])
        expect(mockResponse.send).not.toHaveBeenCalled()
    })

    it('should return newWishlistProductId when addProductFromUserWishlist is called', async () => {
        const mockResponse = newResponse()
        await usersController.addProductToWishlist(1, "1", mockResponse)
        expect(spyUsersService.addProductFromUserWishlist).toHaveBeenCalledWith(1, 1)
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.json).not.toHaveBeenCalled()
    })

    it('should return true when deleteProductFromUserWishlist is called', async () => {
        const mockResponse = newResponse()
        await usersController.deleteProductFromWishlist(1, 1, mockResponse)
        expect(spyUsersService.deleteProductFromUserWishlist).toHaveBeenCalledWith(1, 1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.send).toHaveBeenCalled()
        expect(mockResponse.json).not.toHaveBeenCalled()
    })
    it('should return a review list when getUserReviews is called', async () => {
        const mockResponse = newResponse()
        await usersController.getUserReviews(1, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            'pending': [],
            'created': []
        })
    })
    it('should return status code 404 when retrieving the reviews if the user does not exist', async () => {
        jest.spyOn(spyUsersService, 'exists').mockResolvedValueOnce(false)
        const mockResponse = newResponse()
        await usersController.getUserReviews(1, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalledWith('The user does not exist')
    })
    it('should fail when an unexpected error happens', async () => {
        jest.spyOn(spyUsersService, 'exists').mockRejectedValueOnce(new Error('Internal Error'))
        const mockResponse = newResponse()
        await usersController.getUserReviews(1, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(500)
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalledWith('Unexpected error ocurred, try later')
    })

    it('should return status code 201 when user and product exists and the review does not exists from this user', async () => {
        const mockResponse = newResponse()
        await usersController.createUserReview(1, mockResponse, { productId: "1", productName: '', rating: 5, comment: '' })
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(spyProductsService.exists).toHaveBeenCalledWith("1")
        expect(spyReviewsService.existsReviewFromUser).toHaveBeenCalledWith("1", 1)
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.send).toHaveBeenCalled()
    })

    it('should return status code 400 when user and product exists and the review exists from this user', async () => {
        const mockResponse = newResponse()
        jest.spyOn(spyReviewsService, 'existsReviewFromUser').mockResolvedValueOnce(true)
        await usersController.createUserReview(1, mockResponse, { productId: "1", productName: '', rating: 5, comment: '' })
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(spyProductsService.exists).toHaveBeenCalledWith("1")
        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.send).toHaveBeenCalledWith('The review for the product with id 1 already exists')
    })

    it('should return status code 404 when user or product does not exist ', async () => {
        const mockResponse = newResponse()
        jest.spyOn(spyProductsService, 'exists').mockResolvedValueOnce(false)
        await usersController.createUserReview(1, mockResponse, { productId: "1", productName: '', rating: 5, comment: '' })
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(spyProductsService.exists).toHaveBeenCalledWith("1")
        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.send).toHaveBeenCalledWith('The user or product does not exist')
    })

    it('should fail when an unexpected error happens', async () => {
        jest.spyOn(spyProductsService, 'exists').mockRejectedValueOnce(new Error('Internal Error'))
        const mockResponse = newResponse()
        await usersController.createUserReview(1, mockResponse, { productId: "1", productName: '', rating: 5, comment: '' })
        expect(mockResponse.status).toHaveBeenCalledWith(500)
        expect(mockResponse.send).toHaveBeenCalledWith('Unexpected error ocurred, try later')
    })

    it('should return a user review when user and review exists', async () => {
        const mockResponse = newResponse()
        await usersController.getReview(1, 5, mockResponse)
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            id: 1,
            productId: 5,
            productName: "Biba palette",
            rating: 5,
            comment: "tfukygilhoñp´ìopiñyuligykfugiloñp´òuylgluhoñp´`ç"
        })
    })

    it('should return status code 404 when user does not exist', async () => {
        const mockResponse = newResponse()
        jest.spyOn(spyUsersService, 'exists').mockResolvedValueOnce(false)
        await usersController.getReview(1, 5, mockResponse)
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalledWith('User not found')
    })

    it('should return status code 500 when unexpected error happens', async () => {
        const mockResponse = newResponse()
        jest.spyOn(spyUsersService, 'exists').mockRejectedValueOnce(new Error('Internal Error'))
        await usersController.getReview(1, 5, mockResponse)
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(mockResponse.status).toHaveBeenCalledWith(500)
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalledWith('Unexpected error ocurred, try later')
    })

    it('should return status code 201 when review is updated', async () => {
        const mockResponse = newResponse()
        jest.spyOn(spyReviewsService, 'existsReviewFromUser').mockResolvedValueOnce(true)
        await usersController.updateReview(1, 1, mockResponse, { productId: 10, rating: 1, comment: "" })
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(spyReviewsService.existsReviewFromUser).toHaveBeenCalledWith("10", 1)
        expect(spyUsersService.updateUserReview).toHaveBeenCalledWith(1, 1, { productId: 10, rating: 1, comment: "" })
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.send).toHaveBeenCalled()
    })

    it('should return status code 403 when user does not exist', async () => {
        const mockResponse = newResponse()
        jest.spyOn(spyUsersService, 'exists').mockResolvedValueOnce(false)
        await usersController.updateReview(1, 1, mockResponse, { productId: 10, rating: 1, comment: "" })
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(spyUsersService.updateUserReview).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.send).toHaveBeenCalledWith('User or review not found')
    })

    it('should return status code 500 when unexpected error happens', async () => {
        const mockResponse = newResponse()
        jest.spyOn(spyUsersService, 'exists').mockRejectedValueOnce('Internal Server Error')
        await usersController.updateReview(1, 1, mockResponse, { productId: 10, rating: 1, comment: "" })
        expect(spyUsersService.exists).toHaveBeenCalledWith(1)
        expect(spyUsersService.updateUserReview).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(500)
        expect(mockResponse.send).toHaveBeenCalledWith('Unexpected error ocurred, try later')
    })

    it('should return status code 201 when email is not on database and the user has been created', async () => {
        const data = {
            email: "exdream76@gmail.com",
            password: "1234ABcde!",
            repeatPassword: "1234ABcde!"
        }
        const mockResponse = newResponse()
        await usersController.userSignup(mockResponse, data)
        expect(spyUsersService.emailExistsOnDB).toHaveBeenCalledWith('exdream76@gmail.com')
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.json).toHaveBeenCalledWith(100)

    })

    it('should return status code 400 when email has invalid format', async () => {
        const data = {
            email: "exdream76@gmailcom",
            password: "1234ABcde!",
            repeatPassword: "1234ABcde!"
        }
        const mockResponse = newResponse()
        jest.spyOn(spyValidationService, 'validateEmail').mockResolvedValueOnce(false)
        await usersController.userSignup(mockResponse, data)
        expect(spyValidationService.validateEmail).toHaveBeenCalledWith('exdream76@gmailcom')
        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'The email has invalid format' })
    })

    it('should return status code 401 when email is on database and the user has not been created', async () => {
        const data = {
            email: "exdream76@gmail.com",
            password: "1234ABcde!",
            repeatPassword: "1234ABcde!"
        }
        const mockResponse = newResponse()
        jest.spyOn(spyUsersService, 'emailExistsOnDB').mockResolvedValueOnce(true)
        await usersController.userSignup(mockResponse, data)
        expect(spyUsersService.emailExistsOnDB).toHaveBeenCalledWith('exdream76@gmail.com')
        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'The user is registered' })
    })

    it('should return status code 500 when unexpected error happens', async () => {
        const data = {
            email: "exdream76@gmail.com",
            password: "1234ABcde!",
            repeatPassword: "1234ABcde!"
        }
        const mockResponse = newResponse()
        jest.spyOn(spyUsersService, 'emailExistsOnDB').mockRejectedValueOnce(new Error('Internal Server Error'))
        await usersController.userSignup(mockResponse, data)
        expect(spyUsersService.emailExistsOnDB).toHaveBeenCalledWith('exdream76@gmail.com')
        expect(mockResponse.status).toHaveBeenCalledWith(500)
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
    })
})