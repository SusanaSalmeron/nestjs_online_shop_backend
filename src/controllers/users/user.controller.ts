import { Body, Controller, HttpStatus, Logger, Post, Get, Res, Query, Param } from "@nestjs/common";
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
                    console.log(token)
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
                response.status(HttpStatus.NOT_FOUND).json(user)
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')

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




}