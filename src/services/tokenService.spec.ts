import { ConfigService } from "@nestjs/config"
import { Test, TestingModule } from "@nestjs/testing"
import { LoginUser } from "../classes/loginUser"
import { TokenService } from "./token.service"


describe('TokenService', () => {
    let tokenService: TokenService
    let configService: ConfigService

    const fakeUSer: LoginUser = new LoginUser(
        1,
        "Susana",
        "mamamama@gmail.com",
        "Abcde123!"
    )

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TokenService, {
                provide: ConfigService, useValue: {
                    get: jest.fn(() => {
                        return "secret_key"
                    })
                }
            }]
        }).compile()

        tokenService = module.get<TokenService>(TokenService)
        configService = module.get<ConfigService>(ConfigService)
    })
    it('should create a token', async () => {
        const result = await tokenService.createToken(fakeUSer)
        expect(result).toBeTruthy()
        expect(configService.get).toHaveBeenCalledWith('SECRET_KEY')
        expect(configService.get).toHaveReturnedWith('secret_key')

    })



})