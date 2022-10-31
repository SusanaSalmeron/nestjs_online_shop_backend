import { Body, Controller, HttpStatus, Logger, Post, Get, Res, Query, Param, Put, Delete, ParseIntPipe, Head } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiQuery, ApiNoContentResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import { SearchService } from '../../services/search.service';
import { CreateUserDto } from '../../dto/createUserDto';
import { OptionsMenuDto } from '../../dto/optionsMenuDto';
import { ProductDto } from '../../dto/productDto';
import { UserDataDto } from '../../dto/userDataDto';
import * as bcrypt from 'bcrypt';
import { AccountUserData } from 'src/classes/accountUserData';
import { AccountUserAddresses } from '../../classes/accountUserAddresses';
import { UpdateUserAccountPasswordDto } from '../../dto/updateUserAccountPasswordDto';
import { UserAddressDto } from '../../dto/userAddressesDto';
import { UpdateUserAccountDataDto } from '../../dto/updateUserAccountDataDto';
import { UpdateUserAccountAddressesDto } from '../../dto/updateUserAccountAddressesDto';
import { UpdateBillingAddressDto } from '../../dto/updateBillingAddressDto'
import { OrderOverviewDto } from '../../dto/orderOverviewDto'
import { OrderOverview } from '../../classes/orderOverview';
import { OrdersService } from '../../services/orders.service';
import { CreateUserAddressDto } from '../../dto/createUserAddressDto';
import { DeleteAddressDto } from '../../dto/deleteAddressDto';
import { ProductCard } from '../../classes/productCard';
import { Search } from '../../classes/search';
import { Product } from '../../classes/product';
import { ProductsService } from '../../services/products.service';
import { WishlistService } from '../../services/wishlist.service';
import { Reviews } from '../../classes/reviews';
import { CreateNewReviewDto } from '../../dto/createNewReviewDto';
import { ReviewsService } from '../../services/review.service';
import { UpdateReviewDto } from '../../dto/updateReviewDto';


@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name)
    constructor(private usersService: UsersService, private tokenService: TokenService, private searchService: SearchService, private ordersService: OrdersService, private productsService: ProductsService, private wishlistService: WishlistService, private reviewsService: ReviewsService) { }

    @Post('/login')
    @ApiBody({
        description: 'User',
        required: true,
        type: CreateUserDto
    })
    @ApiOkResponse({ description: 'User Login successfully' })
    @ApiNotFoundResponse({ description: 'User does not exists' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async userLogin(@Res() response, @Body() createUserDto: CreateUserDto) {
        const { email, password } = createUserDto
        try {
            const user = await this.usersService.findUserByEmail(email)
            console.log(1)
            if (!user) {
                this.logger.error('User not found')
                response.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' })
            } else {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    this.logger.debug('Login successfully')
                    const token = await this.tokenService.createToken(user)
                    response.status(HttpStatus.OK).json({ id: user.id, name: user.userName, token: token })
                } else {
                    this.logger.error('Password or/and email error')
                    response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Password or/and email error' })
                }
            }
        } catch (err) {
            this.logger.error('Internal server error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error ')
        }
    }
    @Get('/:id/data')
    @ApiOkResponse({
        description: 'Getting user data successfully',
        type: UserDataDto
    })
    @ApiNotFoundResponse({ description: 'No user found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async userAccountData(@Param('id', ParseIntPipe) id: number, @Res() response) {
        try {
            const user: AccountUserData = await this.usersService.findUserById(id)
            if (user) {
                this.logger.log(`User with id ${id} finded successfully`)
                response.status(HttpStatus.OK).json(user)
            } else {
                this.logger.log(`User with id ${id} does not exists`)
                response.status(HttpStatus.NOT_FOUND).send()
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')
        }
    }

    @Put('/:id/data')
    @ApiOkResponse({
        description: 'User data successfully updated',
        type: UpdateUserAccountDataDto
    })
    @ApiNotFoundResponse({ description: 'User data has not been updated' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async updateUserAccountData(@Param('id', ParseIntPipe) id: number, @Res() response, @Body() updateUserAccountData: UpdateUserAccountDataDto) {
        const { userName, surname, identification, dateOfBirth, email, phone } = updateUserAccountData
        try {
            const newData: boolean = await this.usersService.changeUserAccountData(id, userName, surname, identification, dateOfBirth, email, phone)
            if (newData) {
                this.logger.log('User data successfully updated ')
                response.status(HttpStatus.OK).json(newData)
            } else {
                this.logger.log('The data has not been updated')
                response.status(HttpStatus.NOT_FOUND).send('User data has not benn updated')
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')
        }
    }

    @Get('/:id/addresses/')
    @ApiOkResponse({
        description: 'Getting addresses successfully',
        type: UserAddressDto
    })
    @ApiNotFoundResponse({ description: 'No Addresses' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async userAccountAdresses(@Param('id', ParseIntPipe) id: number, @Res() response) {
        try {
            const addresses: AccountUserAddresses[] = await this.usersService.findAddressesBy(id)
            if (addresses) {
                this.logger.log(`Addresses from user id ${id} found`)
                response.status(HttpStatus.OK).json(addresses)
            } else {
                this.logger.log(`the user id ${id} has not addresses`)
                response.status(HttpStatus.NOT_FOUND).json(addresses)
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')
        }
    }

    @Put('/:userid/addresses/:addressid')
    @ApiOkResponse({
        description: 'Address updated successfully',
        type: UpdateUserAccountAddressesDto
    })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async updateUserAccountAddresses(@Param('userid', ParseIntPipe) userId: number, @Param('addressid', ParseIntPipe) addressId: number, @Res() response, @Body() updateUserAccountAddresses: UpdateUserAccountAddressesDto) {
        const { userName, surname, address, postalZip, city, country, defaultAddress } = updateUserAccountAddresses
        try {
            const newAddress: boolean = await this.usersService.changeUserAccountAddress(addressId, userName, surname, address, postalZip, city, country, defaultAddress, userId)
            if (newAddress) {
                this.logger.log('Address updated successfully')
                response.status(HttpStatus.OK).json(newAddress)
            } else {
                this.logger.log('Address not updated')
                response.status(HttpStatus.NOT_FOUND).json({ error: `user ${userId} not found` })
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Delete('/:userId/addresses/:addressId')
    @ApiOkResponse({ description: 'Address deleted successfully' })
    @ApiNotFoundResponse({ description: 'User or address not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async deleteAddress(@Param() deleteAddressDto: DeleteAddressDto, @Res() response) {
        const { addressId, userId } = deleteAddressDto
        try {
            const addressDeleted: boolean = await this.usersService.deleteAddress(deleteAddressDto)
            if (addressDeleted) {
                this.logger.log('Address deleted successfully')
                response.status(HttpStatus.OK).send()
            } else {
                this.logger.error(`Address ${addressId} or user ${userId} not found`)
                response.status(HttpStatus.NOT_FOUND).json({ error: `Address ${addressId} or user ${userId} not found` })
            }
        } catch (err) {
            this.logger.error('Internal Server Error')
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Post('/:id/addresses/new')
    @ApiBody({
        description: 'New Address',
        required: true,
        type: CreateUserAddressDto
    })
    @ApiCreatedResponse({ description: 'Address Created' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async addUserAccountAddress(@Param('id', ParseIntPipe) userId: number, @Res() response, @Body() createUserAddressDto: CreateUserAddressDto) {
        try {
            const newAddress: number = await this.usersService.addNewShippingAddress(userId, createUserAddressDto)
            if (newAddress) {
                this.logger.log('new address created')
                response.status(HttpStatus.CREATED).json(newAddress)
            } else {
                this.logger.error('new address can not be created')
                response.status(HttpStatus.NOT_FOUND).json({ error: 'the user id does not exists' })
            }
        } catch (err) {
            this.logger.error('Internal Server Error')
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Put(':id/billing')
    @ApiOkResponse({
        description: 'Billing Address Updated',
        type: UpdateBillingAddressDto
    })
    @ApiNotFoundResponse({ description: 'New billing address not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async updateUserAccountBillingAddress(@Param('id', ParseIntPipe) userId: number, @Res() response, @Body() updateBillingAddressDto: UpdateBillingAddressDto) {
        const { userName, surname, address, postalZip, city, country
            , identification } = updateBillingAddressDto
        try {
            const newAddress: boolean = await this.usersService.changeUserAccountBillingAddress(userId, userName, surname, address, postalZip, city, country, identification)
            if (newAddress) {
                this.logger.log('Billing Address updated')
                response.status(HttpStatus.OK).json(newAddress)
            } else {
                this.logger.log('Billing Address not updated')
                response.status(HttpStatus.NOT_FOUND).send()
            }
        } catch (err) {
            this.logger.error('Internal Server Error')
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Get('/search')
    @ApiOkResponse({
        description: 'Getting products successfully',
        type: OptionsMenuDto
    })
    @ApiNotFoundResponse({ description: 'No products' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async userSearch(@Res() response) {
        try {
            const products: Search[] = await this.searchService.findAllBrandsAndNames()
            if (products) {
                this.logger.log('products getting successfully')
                response.status(HttpStatus.OK).json(products)
            } else {
                this.logger.error('products not found')
            }
        } catch (err) {
            this.logger.error('Internal Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Error')
        }
    }

    @Get('/search/:keyword')
    @ApiQuery({
        name: 'keyword',
        required: true
    })
    @ApiOkResponse({
        description: 'Products found successfully',
        type: ProductDto
    })
    @ApiNotFoundResponse({
        description: 'No products found'
    })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async userSearchList(@Query('keyword') keyword: string, @Res() response) {
        try {
            const products: Product[] = await this.searchService.searchList(keyword)
            if (products.length) {
                this.logger.log('Products found successfully')
                response.status(HttpStatus.OK).json(products)
            } else {
                this.logger.log('No products with this keyword')
                response.status(HttpStatus.NOT_FOUND).json(products)
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')
        }
    }

    @Put('/:id/password')
    @ApiOkResponse({
        description: 'Password updated successfully',
        type: UpdateUserAccountPasswordDto
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error'
    })
    async updateUserAccountPassword(@Param('id', ParseIntPipe) id: number, @Res() response, @Body() updateAccountUserPasswordDto: UpdateUserAccountPasswordDto) {
        const { password, newPassword, repeatNew } = updateAccountUserPasswordDto
        try {
            const newData: boolean = await this.usersService.changeUserAccountPassword(id, password, newPassword, repeatNew)
            if (newData) {
                this.logger.log('Password updated successfully')
                response.status(HttpStatus.OK).json(newData)
            } else {
                this.logger.log('Password not updated')
                response.status(HttpStatus.OK).send()
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Internal Server Error'
            })
        }
    }

    @Get('/:id/orders')
    @ApiOkResponse({
        description: 'Getting orders successfully',
        type: OrderOverviewDto
    })
    @ApiNotFoundResponse({ description: 'No Orders' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async userOrders(@Param('id', ParseIntPipe) userId: number, @Res() response) {
        try {
            const orders: OrderOverview[] = await this.ordersService.findOrdersBy(userId)
            if (orders) {
                this.logger.log(`Showing all orders from user ${userId}`)
                response.status(HttpStatus.OK).json(orders)
            } else {
                this.logger.log(`The user ${userId} has no orders to show`)
                response.status(HttpStatus.NOT_FOUND).send()
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }


    @Get('/:id/orders/:orderid')
    @ApiOkResponse({
        description: 'Order found successfully',
        type: OrderOverviewDto
    })
    @ApiNotFoundResponse({
        description: 'No order found'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error'
    })
    async userOrder(@Param('id', ParseIntPipe) userId: number, @Param('orderid', ParseIntPipe) orderId: number, @Res() response) {
        try {
            const order: OrderOverview = await this.ordersService.findOrderBy(userId, orderId)
            if (order) {
                this.logger.log(`showing order ${orderId} from user ${userId}`)
                response.status(HttpStatus.OK).json(order)
            } else {
                this.logger.log(`this order from user ${userId} do not exists`)
                response.status(HttpStatus.NOT_FOUND).send()
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Get('/:id/orders/status/:status')
    @ApiOkResponse({
        description: 'Getting orders successfully',
        type: OrderOverviewDto
    })
    @ApiNotFoundResponse({ description: 'No Orders' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async userOrdersByStatus(@Param('id', ParseIntPipe) userId: number, @Param('status') status: string, @Res() response) {
        try {
            const orders: OrderOverview[] = await this.ordersService.findAllOrdersBy(status, userId)
            if (orders) {
                this.logger.log('Orders finded successfully')
                response.status(HttpStatus.OK).json(orders)
            } else {
                this.logger.error(`The user with id ${userId} does not exists`)
                response.status(HttpStatus.NOT_FOUND).json({ error: `The user with id ${userId} does not exists` })
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Head(':id/wishlist/:productid')
    @ApiOkResponse({
        description: 'The product is in the wishlist',
    })
    @ApiBadRequestResponse({ description: 'User and product not found' })
    @ApiNotFoundResponse({ description: 'The product is not in the wishlist' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async checkProductOnWishlist(@Param('id', ParseIntPipe) userId: number, @Param('productid', ParseIntPipe) productId: string, @Res() response) {
        const user = await this.usersService.exists(userId)
        const product = await this.productsService.exists(productId)
        if (user && product) {
            this.logger.log(`User ${userId} and product ${productId} found`)
            try {
                const checkedProduct: boolean = await this.wishlistService.findProductOnWishlist(userId, parseInt(productId))
                if (!checkedProduct) {
                    this.logger.log('The product is not in the wishlist')
                    response.status(HttpStatus.NOT_FOUND).send()
                } else {
                    this.logger.error('The product is in the wishlist')
                    response.status(HttpStatus.OK).json({ message: 'The product is in the wishlist' })
                }
            } catch (err) {
                this.logger.error('Internal Server Error')
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
            }
        } else {
            this.logger.error(`User ${userId} and product ${productId} not found`)
            response.status(HttpStatus.BAD_REQUEST).json({ error: `User ${userId} and product ${productId} not found` })
        }
    }


    @Get('/:id/wishlist')
    @ApiOkResponse({
        description: 'Getting wishlist successfully',
    })
    @ApiNotFoundResponse({ description: 'No wishlist' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async findUserWishlist(@Param('id', ParseIntPipe) userId: number, @Res() response) {
        try {
            const wishlist: ProductCard[] = await this.usersService.getWishlist(userId)
            if (wishlist) {
                this.logger.log('Wishlist finded successfully')
                response.status(HttpStatus.OK).json(wishlist)
            } else {
                this.logger.error('The wishlist is empty')
                response.status(HttpStatus.NOT_FOUND).json({ error: 'Wishlist not found' })
            }
        } catch (err) {
            this.logger.error('Internal Server Error')
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Put(':userid/wishlist/:productid')
    @ApiCreatedResponse({
        description: 'Product from wishlist added successfully',
    })
    @ApiNoContentResponse({ description: 'The product already exists in the wishlist' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async addProductToWishlist(@Param('userid', ParseIntPipe) userId: number, @Param('productid', ParseIntPipe) productId: string, @Res() response) {
        const user: boolean = await this.usersService.exists(userId)
        const product: boolean = await this.productsService.exists(productId)
        if (user && product) {
            try {
                const newProductToAddToWishlist: boolean = await this.usersService.addProductFromUserWishlist(userId, parseInt(productId))
                if (newProductToAddToWishlist) {
                    this.logger.log('Product added to wishlist successfully')
                    response.status(HttpStatus.CREATED).send()
                } else {
                    this.logger.error('The product already exists in the wishlist')
                    response.status(HttpStatus.NO_CONTENT).json({ message: 'The product already exists in the wishlist' })
                }
            } catch (err) {
                this.logger.error('Internal Server Error', err)
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
            }
        } else {
            this.logger.error(`The user ${userId} or the product ${productId} does not exists`)
            response.status(HttpStatus.NOT_FOUND).json({ error: `The user ${userId} or the product ${productId} does not exists` })
        }

    }

    @Delete('/:id/wishlist/:productid')
    @ApiOkResponse({
        description: 'Product from wishlist remove successfully',
    })
    @ApiNotFoundResponse({ description: 'User id or product id not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async deleteProductFromWishlist(@Param('id', ParseIntPipe) userId: number, @Param('productid', ParseIntPipe) productId: number, @Res() response) {
        try {
            const productDeleted: boolean = await this.usersService.deleteProductFromUserWishlist(userId, productId)
            if (productDeleted) {
                this.logger.log('Product remove from wishlist successfully')
                response.status(HttpStatus.OK).send()
            } else {
                this.logger.error(`User ${userId} or product id ${productId} does not exists`)
                response.status(HttpStatus.NOT_FOUND).json({ error: `User ${userId} or product id ${productId} does not exists` })
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Get('/:userId/reviews')
    @ApiOkResponse({
        description: 'Getting reviews successfully',
    })
    @ApiNotFoundResponse({ description: 'The user does not exist' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async getUserReviews(@Param('userId', ParseIntPipe) userId: number, @Res() response) {
        try {
            const userExists = await this.usersService.exists(userId)
            if (userExists) {
                const myReviews: Reviews = await this.usersService.findUserReviews(userId)
                this.logger.log('Reviews found successfully')
                response.status(HttpStatus.OK).json(myReviews)
            } else {
                this.logger.error('The user does not exist')
                response.status(HttpStatus.NOT_FOUND).send('The user does not exist')
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Unexpected error ocurred, try later')
        }
    }

    @Get('/:userId/reviews/:reviewId')
    @ApiOkResponse({
        description: 'Getting review successfully',
    })
    @ApiNotFoundResponse({ description: 'The user does not exist' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async getReview(@Param('userId', ParseIntPipe) userId: number, @Param('reviewId', ParseIntPipe) reviewId: number, @Res() response) {
        try {
            const userExists = await this.usersService.exists(userId)
            if (userExists) {
                const myReview = await this.usersService.findReviewBy(userId, reviewId)
                response.status(HttpStatus.OK).json(myReview)
            } else {
                response.status(HttpStatus.NOT_FOUND).send('User not found')
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Unexpected error ocurred, try later')
        }
    }

    @Put('/:userId/reviews/:reviewId')
    @ApiCreatedResponse({
        description: 'Review updated successfully',
    })
    @ApiNotFoundResponse({ description: 'The user or review does not exist' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @ApiBody({
        description: 'Update Review',
        required: true,
        type: UpdateReviewDto
    })
    async updateReview(@Param('userId', ParseIntPipe) userId: number, @Param('reviewId', ParseIntPipe) reviewId: number, @Res() response, @Body() updateReviewDto: UpdateReviewDto) {
        const { productId } = updateReviewDto
        try {
            const userExists = await this.usersService.exists(userId)
            const reviewExists = await this.reviewsService.existsReviewFromUser(productId.toString(), userId)
            if (userExists && reviewExists) {
                await this.usersService.updateUserReview(userId, reviewId, updateReviewDto)
                this.logger.log('Review updated successfully')
                response.status(HttpStatus.CREATED).send()
            } else {
                this.logger.error('User not found')
                response.status(HttpStatus.NOT_FOUND).send('User or review not found')
            }
        } catch (err) {
            this.logger.error('Internal server error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Unexpected error ocurred, try later')
        }
    }


    @Post('/:userId/review')
    @ApiBody({
        description: 'New Review',
        required: true,
        type: CreateNewReviewDto
    })
    @ApiCreatedResponse({
        description: 'Review created successfully',
    })
    @ApiBadRequestResponse({
        description: 'The review for this product has been created previously'
    })
    @ApiNotFoundResponse({ description: 'The user or product does not exist' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async createUserReview(@Param('userId', ParseIntPipe) userId: number, @Res() response, @Body() createNewReviewDto: CreateNewReviewDto) {
        const { productId } = createNewReviewDto
        try {
            const userExists = await this.usersService.exists(userId)
            const productExists = await this.productsService.exists(productId)
            const reviewExists = await this.reviewsService.existsReviewFromUser(productId, userId)
            if (userExists && productExists && !reviewExists) {
                this.logger.log('Review created successfully')
                await this.usersService.addNewReview(userId, createNewReviewDto)
                response.status(HttpStatus.CREATED).send()
            } else if (userExists && productExists) {
                this.logger.error('The review for this product has been created previously')
                response.status(HttpStatus.BAD_REQUEST).send(`The review for the product with id ${productId} already exists`)
            } else {
                this.logger.error('The user or product does not exist')
                response.status(HttpStatus.NOT_FOUND).send('The user or product does not exist')
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Unexpected error ocurred, try later')
        }
    }


}
