import { Controller, Get, Logger, Param, HttpStatus, Res } from "@nestjs/common";
import { ProductService } from "../../services/product.service";
import {
    ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse

} from "@nestjs/swagger";
import {
    ProductCard
} from "../../classes/productCard";

@Controller('product')
export class ProductController {
    private readonly logger = new Logger(ProductController.name)
    constructor(private productService: ProductService) { }

    @Get('/:id')
    @ApiOkResponse({
        description: 'find appointments successfully',
        type: ProductCard
    })
    @ApiNotFoundResponse({ description: 'appointments not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async showProduct(@Param('id') id: string, @Res() response) {
        try {
            const product = await this.productService.findProductById(id)
            if (product) {
                this.logger.debug(`Product with id ${id} finded successfully`)
                response.status(HttpStatus.OK).json(product)
            } else {
                this.logger.error(`Product does not exist with id ${id}`)
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')
        }
    }
}