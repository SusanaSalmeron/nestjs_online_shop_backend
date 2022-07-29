import { Controller, Get, Logger, Param, HttpStatus, Res, Query } from "@nestjs/common";
import { ProductService } from "../../services/product.service";
import { ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { ProductDto } from "src/dto/productDto";
import { ProductCardDto } from "src/dto/productCardDto";


@Controller('products')
export class ProductController {
    private readonly logger = new Logger(ProductController.name)
    constructor(private productService: ProductService) { }

    @Get('new')
    @ApiOkResponse({
        description: 'New Products finded successfully',
        type: ProductCardDto
    })
    @ApiNotFoundResponse({ description: 'No new products' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async showNewProducts(@Res() response) {
        try {
            const newProducts = await this.productService.findNewProducts()
            if (newProducts) {
                this.logger.log('Products find successfully')
                response.status(HttpStatus.OK).json(newProducts)
            } else {
                this.logger.error('No new products')
                response.status(HttpStatus.NOT_FOUND).send('No new products to show')
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')
        }
    }
    @Get('type')
    @ApiOkResponse({
        description: "All products found successfully",
        type: ProductDto
    })
    @ApiNotFoundResponse({ description: "Products not found" })
    @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
    async showAllProducts(@Query('type') type: string, @Res() response) {
        try {
            const allProducts = await this.productService.findProductsBy(type)
            if (allProducts) {
                this.logger.debug('Finded all products successfully')
                response.status(HttpStatus.OK).json(allProducts)
            } else {
                this.logger.error('Products not found')
                response.status(HttpStatus.NOT_FOUND).send('Products not found')
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')
        }
    }

    @Get('/:id')
    @ApiOkResponse({
        description: 'find product successfully',
        type: ProductCardDto
    })
    @ApiNotFoundResponse({ description: 'product not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async showProduct(@Param('id') id: string, @Res() response) {
        try {
            const product = await this.productService.findProductById(id)
            if (product) {
                this.logger.debug(`Product with id ${id} finded successfully`)
                response.status(HttpStatus.OK).json(product)
            } else {
                this.logger.error(`Product does not exist with id ${id}`)
                response.status(HttpStatus.NOT_FOUND).send('`Product does not exist with id ${id}`')
            }
        } catch (err) {
            this.logger.error('Internal Server Error', err)
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error')
        }
    }
}