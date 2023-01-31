import { Inject, Injectable, Logger } from "@nestjs/common";
import { LoginUser } from "../classes/loginUser";
import { AccountUserData } from '../classes/accountUserData'
import * as loki from 'lokijs';
import { AccountUserAddresses } from "../classes/accountUserAddresses";
import { encrypt } from './security.service';
import * as bcrypt from 'bcrypt'
import { UpdateBillingAddress } from "../classes/updateBillingAddresses";
import { ProductsService } from "./products.service";
import { CreateUserAddressDto } from "../dto/createUserAddressDto";
import { DeleteAddressDto } from "../dto/deleteAddressDto";
import { Wishlist } from "../classes/wishlist";
import { ProductCard } from "../classes/productCard";
import { Reviews } from "../classes/reviews";
import { Review } from "../classes/review";
import { OrdersService } from "./orders.service";
import { ProductWithoutReview } from "../classes/productWithoutReview";
import { OrderOverview } from "../classes/orderOverview";
import { CreateNewReviewDto } from "src/dto/createNewReviewDto";
import { UpdateReviewDto } from "../dto/updateReviewDto";
import { UserSignupDto } from "src/dto/userSignupDto";


@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)
    private addressId = 32
    private productWishlistId = 13
    private reviewId = 11
    private userId = 1001
    constructor(@Inject('DATABASE_CONNECTION') private db: loki, private productsService: ProductsService, private ordersService: OrdersService) { }

    getNextReviewId(): number {
        return this.reviewId
    }

    async findUserByEmail(email: string): Promise<LoginUser> {
        const usersTable = this.db.getCollection('users')
        const foundUser: LoginUser = usersTable.findOne({ email: email })
        if (foundUser) {
            this.logger.log(`User found successfully`)
            return new LoginUser(
                foundUser.id,
                foundUser.userName,
                foundUser.email,
                foundUser.password
            )
        } else {
            this.logger.warn('User not found')
            return null
        }
    }

    async findUserById(id: number): Promise<AccountUserData> {
        const usersTable = this.db.getCollection('users')
        const foundUserData: AccountUserData = usersTable.findOne({ id: id })
        if (foundUserData) {
            this.logger.log(`User ${id} found successfully`)
            return new AccountUserData(
                foundUserData.id,
                foundUserData.userName,
                foundUserData.surname,
                foundUserData.address,
                foundUserData.postalZip,
                foundUserData.city,
                foundUserData.country,
                foundUserData.phone,
                foundUserData.email,
                foundUserData.dateOfBirth,
                foundUserData.identification,
                foundUserData.password)
        } else {
            this.logger.warn(`User ${id} does not exist`)
            return null
        }
    }

    async findAddressesBy(userId: number): Promise<AccountUserAddresses[]> {
        const addressesTable = this.db.getCollection('addresses')
        let addresses: AccountUserAddresses[]
        const foundAddresses: AccountUserAddresses[] = addressesTable.find({ userId: userId })
        if (foundAddresses) {
            this.logger.log(`Addresses from user ${userId} found successfully`)
            addresses = foundAddresses.map(a => {
                return new AccountUserAddresses(
                    a.id,
                    a.userName,
                    a.surname,
                    a.address,
                    a.postalZip,
                    a.city,
                    a.country,
                    a.defaultAddress,
                    a.userId
                )
            })
        } else {
            this.logger.warn(`Addresses from user ${userId} does not exist`)
            return null
        }
        return addresses
    }

    async addNewShippingAddress(userId: number, createUserAddressDto: CreateUserAddressDto): Promise<number> {
        if (await this.exists(userId)) {
            const addressesTable = this.db.getCollection('addresses')
            const { userName, surname, address, postalZip, city, country, defaultAddress } = createUserAddressDto
            const newId: number = this.addressId++
            addressesTable.insert(
                {
                    id: newId,
                    userName: userName,
                    surname: surname,
                    address: address,
                    postalZip: postalZip,
                    city: city,
                    country: country,
                    defaultAddress: defaultAddress,
                    userId: userId,
                }
            )
            if (defaultAddress) {
                addressesTable.findAndUpdate({ defaultAddress: true, userId: userId, id: { '$ne': newId } }, (address) => {
                    address.defaultAddress = false
                    return address
                })
            }
            this.logger.log('New address added successfully')
            return newId
        } else {
            this.logger.warn(`The user ${userId} does not exists`)
            return null
        }
    }

    async deleteAddress(deleteAddressDto: DeleteAddressDto): Promise<boolean> {
        const { addressId, userId } = deleteAddressDto
        const addressesTable = this.db.getCollection('addresses')
        const address: AccountUserAddresses = addressesTable.findOne({ id: parseInt(addressId) })
        if (address && address.userId === parseInt(userId)) {
            addressesTable.remove(address)
            this.logger.log('Address has been removed successfully')
            return true
        } else {
            this.logger.warn('The address or user does not exist')
            return false
        }
    }

    async changeUserAccountPassword(userId: number, password: string, newPassword: string, repeatNew: string): Promise<boolean> {
        const usersTable = this.db.getCollection('users')
        const user: AccountUserData = usersTable.findOne({ id: userId })
        const match = await bcrypt.compare(password, user.password)
        if ((user && match) && newPassword === repeatNew) {
            user.password = await encrypt(newPassword)
            this.logger.log('password updated successfully')
            return usersTable.update(user)
        } else {
            this.logger.warn('user does not exists or password does not match')
            return false
        }
    }

    async changeUserAccountData(userId: number, userName: string, surname: string, identification: string, dateOfBirth: string, email: string, phone: string): Promise<boolean> {
        const usersTable = this.db.getCollection('users')
        const user: AccountUserData = usersTable.findOne({ id: userId })
        if (user) {
            user.userName = userName;
            user.surname = surname;
            user.identification = identification;
            user.dateOfBirth = dateOfBirth;
            user.email = email;
            user.phone = phone;
            this.logger.log('user data updated successfully')
            return usersTable.update(user)
        } else {
            this.logger.warn(`user ${userId} does not exists and data not updated`)
            return false
        }
    }

    async changeUserAccountAddress(addressId: number, userName: string, surname: string, address: string, postalZip: string, city: string, country: string, defaultAddress: boolean, userId: number): Promise<boolean> {
        const addressesTable = this.db.getCollection('addresses')
        const addressFound: AccountUserAddresses = addressesTable.findOne({ userId: userId, id: addressId })
        if (addressFound) {
            addressFound.id = addressId
            addressFound.userName = userName;
            addressFound.surname = surname;
            addressFound.address = address;
            addressFound.postalZip = postalZip;
            addressFound.city = city;
            addressFound.country = country;
            addressFound.defaultAddress = defaultAddress;
            addressFound.userId = userId;
            this.logger.log(`Address from user ${userId} updated successfully`)
            return addressesTable.update(addressFound)
        } else {
            this.logger.warn('Address not updated')
            return false
        }
    }

    async changeUserAccountBillingAddress(id: number, userName: string, surname: string, address: string, postalZip: string, city: string, country: string, identification: string): Promise<boolean> {
        const usersTable = this.db.getCollection('users')
        const user: UpdateBillingAddress = usersTable.findOne({ id: id })
        if (user) {
            user.userName = userName;
            user.surname = surname;
            user.address = address;
            user.postalZip = postalZip;
            user.city = city;
            user.country = country;
            user.identification = identification
            this.logger.log(`Billing Address from user ${id} has been updated`)
            return usersTable.update(user)
        } else {
            this.logger.warn(`User ${id} not found`)
            return false
        }
    }

    async getWishlist(userId: number): Promise<ProductCard[]> {
        const wishedProductsTable = this.db.getCollection('wishlist')
        const productList: ProductCard[] = []
        const wishlist: Wishlist[] = wishedProductsTable.find({ userId: userId })
        if (wishlist && wishlist.length > 0) {
            for (let i = 0; i < wishlist.length; i++) {
                const product: ProductCard = await this.productsService.findProductById(wishlist[i].productId.toString())
                this.logger.log(`Product ${wishlist[i].productId} found`)
                productList.push(product)
            }
        }
        this.logger.log('returning wishlist')
        return productList.map(pl =>
            new ProductCard(
                pl.id,
                pl.brand,
                pl.name,
                pl.price,
                pl.description,
                pl.productType,
                pl.api_featured_image,
                pl.product_colors
            ))
    }

    async addProductFromUserWishlist(userId: number, productId: number): Promise<boolean> {
        const wishedProductsTable = this.db.getCollection('wishlist')
        let newWishlistProductId: number
        const productInWishlist: Wishlist = wishedProductsTable.findOne({ userId: userId, productId: productId })
        if (!productInWishlist) {
            newWishlistProductId = this.productWishlistId++
            wishedProductsTable.insert({
                id: newWishlistProductId,
                userId: userId,
                productId: productId
            })
            this.logger.log(`Product with wishlist id ${newWishlistProductId} added successfully`)
            return true
        } else {
            this.logger.warn(`Product ${productId} is already in the wishlist`)
            return false
        }
    }

    async deleteProductFromUserWishlist(userId: number, productId: number): Promise<boolean> {
        const wishedProductsTable = this.db.getCollection('wishlist')
        const productToBeDeleted: Wishlist = wishedProductsTable.findOne({ productId: productId, userId: userId })
        if (productToBeDeleted) {
            this.logger.log('product has been removed')
            wishedProductsTable.remove(productToBeDeleted)
            return true
        } else {
            this.logger.warn('productId or userId does not exist')
            return false
        }
    }

    async exists(userId: number): Promise<boolean> {
        const userFound: AccountUserData = await this.findUserById(userId)
        if (userFound) {
            this.logger.debug(`The user ${userId} exists`)
            return true
        } else {
            this.logger.error(`The user ${userId} does not exists`)
            return false
        }
    }

    async findProductsWithoutReview(userId: number): Promise<ProductWithoutReview[]> {
        const userOrders: OrderOverview[] = await this.ordersService.findOrdersBy(userId)
        const reviewsTable = this.db.getCollection('reviews')
        const productsIdsInReviews: number[] = reviewsTable.find({ userId: userId }).map(review => review.productId)
        const orderPositionTable = this.db.getCollection('orderPosition')
        const orderIds: number[] = userOrders.map(oid => oid.orderId)
        const products = orderPositionTable.find({
            '$and': [
                { orderId: { '$in': orderIds } },
                { productId: { '$nin': productsIdsInReviews } }
            ]
        }).map(p => {
            return {
                productId: p.productId,
                productName: p.productName
            }
        })
        this.logger.log('returning products without review')
        return products
    }

    async findUserReviews(userId: number): Promise<Reviews> {
        const reviewsTable = this.db.getCollection('reviews')
        const foundReviews: Review[] = reviewsTable.find({ userId: userId })
        const pendingReviews: ProductWithoutReview[] = await this.findProductsWithoutReview(userId)
        const reviews = new Reviews(
            pendingReviews,
            foundReviews.map(fr => {
                return new Review(
                    fr.id,
                    fr.productId,
                    fr.productName,
                    fr.rating,
                    fr.comment
                )
            })
        )
        this.logger.log('Returning all reviews from user')
        return reviews
    }

    async findReviewBy(userId: number, reviewId: number): Promise<Review> {
        const reviewsTable = this.db.getCollection('reviews')
        const foundReview: Review = reviewsTable.findOne({ userId: userId, id: reviewId })
        if (foundReview) {
            this.logger.log(`returning review ${foundReview.id} from user ${userId}`)
            return new Review(
                foundReview.id,
                foundReview.productId,
                foundReview.productName,
                foundReview.rating,
                foundReview.comment
            )
        } else {
            this.logger.error('UserId or reviewId not found')
            return null
        }
    }

    async addNewReview(userId: number, createNewReviewDto: CreateNewReviewDto): Promise<number> {
        const reviewsTable = this.db.getCollection('reviews')
        const newReviewId: number = this.reviewId++
        const { productId, productName, rating, comment } = createNewReviewDto
        reviewsTable.insert(
            {
                id: newReviewId,
                productId: parseInt(productId),
                productName: productName,
                userId: userId,
                rating: rating,
                comment: comment
            }
        )
        this.logger.log(`Returning review ${newReviewId}`)
        return newReviewId
    }

    async updateUserReview(userId: number, reviewId: number, updateReviewDto: UpdateReviewDto): Promise<boolean> {
        const reviewsTable: loki = this.db.getCollection('reviews')
        const { productId, rating, comment } = updateReviewDto
        const foundReview: Review = reviewsTable.findOne({ userId: userId, id: reviewId })
        if (foundReview) {
            this.logger.log(`Updating review ${foundReview.id} from user ${userId}`)
            foundReview.productId = productId,
                foundReview.rating = rating,
                foundReview.comment = comment
            return reviewsTable.update(foundReview)
        } else {
            this.logger.error('UserId or reviewId not found')
            return false
        }
    }

    async emailExistsOnDB(email: string): Promise<boolean> {
        const usersTable: loki = this.db.getCollection('users')
        const emailFound: boolean = usersTable.findOne({ email: email })
        if (emailFound) {
            this.logger.log('Email found')
            return true
        } else {
            this.logger.error('Email not found')
            return false
        }
    }

    async addNewUser(userSignupDto: UserSignupDto): Promise<number> {
        const usersTable: loki = this.db.getCollection('users')
        const { email, password } = userSignupDto
        const newUserId: number = this.userId++
        const passwordEncrypted = await encrypt(password)
        usersTable.insert({
            id: newUserId,
            email: email,
            password: passwordEncrypted
        })
        this.logger.log('New user created successfully')
        return newUserId
    }

}