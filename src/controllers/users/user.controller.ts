import { Body, Controller, HttpStatus, Logger, Post, Get, Res, Query, Param, Put } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiQuery } from "@nestjs/swagger";
import { UserService } from "../../services/user.service";
import { TokenService } from "../../services/token.service";
import { SearchService } from "../../services/search.service";
import { CreateUserDto } from "../../dto/createUserDto";
import { OptionsMenuDto } from "../../dto/optionsMenuDto";
import { ProductDto } from "../../dto/productDto";
import { UserDataDto } from "../../dto/userDataDto";
import * as bcrypt from 'bcrypt';
import { AccountUserData } from "src/classes/accountUserData";
import { AccountUserAddresses } from "../../classes/accountUserAddresses";
import { UpdateUserAccountPasswordDto } from "../../dto/updateUserAccountPasswordDto";
import { UserAddressDto } from "../../dto/userAddressesDto";
import { UpdateUserAccountDataDto } from "../../dto/updateUserAccountDataDto";
import { UpdateUserAccountAddressesDto } from "../../dto/updateUserAccountAddressesDto";
import { UpdateBillingAddressDto } from '../../dto/updateBillingAddressDto'
import { OrderOverviewDto } from "../../dto/orderOverviewDto"
import { OrderOverview } from "../../classes/orderOverview";


@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name)
    constructor(private userService: UserService, private tokenService: TokenService, private readonly searchService: SearchService) { }

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
            const user = await this.userService.findUserByEmail(email)
            if (!user) {
                this.logger.error('User not found')
                response.status(HttpStatus.NOT_FOUND).json({ error: "User not found" })
            } else {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    this.logger.debug('Login successfully')
                    const token = await this.tokenService.createToken(user)
                    response.status(HttpStatus.OK).json({ id: user.id, name: user.name, token: token })
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
    async userAccountData(@Param('id') id: string, @Res() response) {
        try {
            const user: AccountUserData = await this.userService.findUserById(id)
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
    async updateUserAccountData(@Param('id') id: string, @Res() response, @Body() updateUserAccountData: UpdateUserAccountDataDto) {
        const { user_name, surname, identification, date_of_birth, email, phone } = updateUserAccountData
        try {
            const newData: boolean = await this.userService.changeUserAccountData(id, user_name, surname, identification, date_of_birth, email, phone)
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
    async userAccountAdresses(@Param('id') id: string, @Res() response) {
        try {
            const addresses: AccountUserAddresses[] = await this.userService.findAddressesBy(id)
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

    @Put('/:id/addresses')
    async updateUserAccountAddresses(@Param('id') userId: string, @Res() response, @Body() updateUserAccountAddresses: UpdateUserAccountAddressesDto) {
        const { id, user_name, surname, address, postalZip, city, country, defaultAddress } = updateUserAccountAddresses
        try {
            const newAddress: boolean = await this.userService.changeUserAccountAddress(id, user_name, surname, address, postalZip, city, country, defaultAddress, userId)
            if (newAddress) {
                this.logger.log('Address updated successfully')
                response.status(HttpStatus.OK).json(newAddress)
            } else {
                this.logger.log('Address not updated')
                response.status(HttpStatus.OK).send()
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" })
        }
    }

    @Put(':id/billing')
    @ApiOkResponse({
        description: 'Billing Address Updated',
        type: UpdateBillingAddressDto
    })
    @ApiNotFoundResponse({ description: 'New billing address not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async updateUserAccountBillingAddress(@Param('id') userId: string, @Res() response, @Body() updateBillingAddressDto: UpdateBillingAddressDto) {
        const { user_name, surname, address, postalZip, city, country
            , identification } = updateBillingAddressDto
        try {
            const newAddress: boolean = await this.userService.changeUserAccountBillingAddress(userId, user_name, surname, address, postalZip, city, country, identification)
            if (newAddress) {
                this.logger.log('Billing Address updated')
                response.status(HttpStatus.OK).json(newAddress)
            } else {
                this.logger.log('Billing Address not updated')
                response.status(HttpStatus.NOT_FOUND).send()
            }
        } catch (err) {
            this.logger.error('Internal Server Error')
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" })
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
            const products = await this.searchService.findAllBrandsAndNames()
            if (products) {
                this.logger.log('products getting successfully')
                response.status(HttpStatus.OK).send(products)
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
        description: "No products found"
    })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async userSearchList(@Query('keyword') keyword: string, @Res() response) {
        try {
            const products = await this.searchService.searchList(keyword)
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
    async updateUserAccountPassword(@Param('id') id: string, @Res() response, @Body() updateAccountUserPasswordDto: UpdateUserAccountPasswordDto) {
        const { password, newPassword, repeatNew } = updateAccountUserPasswordDto
        try {
            const newData: boolean = await this.userService.changeUserAccountPassword(id, password, newPassword, repeatNew)
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
    async userOrders(@Param('id') userId: string, @Res() response) {
        try {
            const orders: OrderOverview[] = await this.userService.findOrdersBy(userId)
            if (orders) {
                this.logger.log(`Showing all orders from user ${userId}`)
                response.status(HttpStatus.OK).json(orders)
            } else {
                this.logger.log(`The user ${userId} has no orders to show`)
                response.status(HttpStatus.NOT_FOUND).send()
            }
        } catch (err) {
            this.logger.error('Internal Server Error')
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
        }
    }

    @Get('/:id/orders/:orderid')
    @ApiOkResponse({
        description: 'Order found successfully',
        type: OrderOverviewDto
    })
    @ApiNotFoundResponse({
        description: "No order found"
    })
    @ApiInternalServerErrorResponse({
        description: "Internal Server Error"
    })
    async userOrder(@Param('id') userId: string, @Param('orderid') orderId: string, @Res() response) {
        try {
            const order: OrderOverview = await this.userService.findOrderBy(userId, orderId)
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





}