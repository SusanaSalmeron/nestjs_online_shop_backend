import { Body, Controller, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from '../../services/products.service';

@Controller('cart')
export class CartController {
    private readonly logger = new Logger(CartController.name)
    constructor(private productService: ProductsService) { }

    @Post('products')
    @ApiBearerAuth('JWT-auth')
    @ApiBody({
        description: 'Cart data',
        required: true,
        type: Array<string>
    })
    @ApiOkResponse({
        description: 'Product with stock',
        type: Boolean
    })
    @ApiNotFoundResponse({ description: 'Product not exists or without stock' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async checkStock(@Body() cartProductList: string[], @Res() response) {
        try {
            const invalidProducts = []
            for (let i = 0; i < cartProductList.length; i++) {
                const productExists = await this.productService.exists(cartProductList[i].toString())
                let productAvailable = false
                if (productExists) {
                    productAvailable = await this.productService.checkProductAvailability(cartProductList[i].toString())
                }
                if (!productAvailable) {
                    invalidProducts.push(cartProductList[i])
                }
            }
            if (invalidProducts.length === 0) {
                response.status(HttpStatus.OK).send()
            } else {
                response.status(HttpStatus.NOT_FOUND).json(invalidProducts)
            }
        } catch (err) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Unexpected error happens, try again' })
        }
    }
}