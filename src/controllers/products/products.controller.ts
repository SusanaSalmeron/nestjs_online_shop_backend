import { Controller, Get, Logger, Param, HttpStatus, Res, Query, ParseIntPipe } from "@nestjs/common";
import { ProductsService } from "../../services/products.service";
import { ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { ProductDto } from "../../dto/productDto";
import { ProductCardDto } from "../../dto/productCardDto";
import { ReviewsService } from "../../services/reviews.service";


@Controller('products')
export class ProductsController {
    private readonly logger = new Logger(ProductsController.name)
    constructor(private productService: ProductsService, private reviewsService: ReviewsService) { }

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

    @Get('/:id/reviews')
    @ApiOkResponse({
        description: 'Getting reviews from product successfully',
    })
    @ApiNotFoundResponse({ description: 'The product does not exist' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async getAllReviewsFromProduct(@Param('id', ParseIntPipe) id: number, @Res() response) {
        try {
            const productExists = await this.productService.exists(id.toString())
            const reviews = await this.reviewsService.getReviewsFromProduct(id)
            if (productExists && reviews) {
                this.logger.log(`Showing product ${id} reviews`)
                response.status(HttpStatus.OK).json(reviews)
            } else {
                this.logger.warn('Product does not exist or does not have reviews')
                response.status(HttpStatus.NOT_FOUND).send({ error: 'The product do not have reviews' })
            }
        } catch {
            this.logger.log('Unexpected error happens, try again')
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Unexpected error happens, try again' })
        }
    }
}