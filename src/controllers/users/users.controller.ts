import { Body, Controller, HttpStatus, Logger, Post, Res } from "@nestjs/common";
import { UsersService } from "src/services/users.service";
import { ApiBody, ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { CreateUserDto } from "src/dto/createUserDto";
import * as bcrypt from 'bcrypt';
import { TokenService } from "src/services/token.service";



@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name)
    constructor(private usersService: UsersService, private tokenService: TokenService) { }

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

}