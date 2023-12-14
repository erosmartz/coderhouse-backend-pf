import { Router } from 'express'
import { passportCall } from '../utils.js'
import {
	createCart,
	getCartById,
	updateCart,
	generateTicket,
	deleteOneProductInCart,
	emptyCart,
	decreaseProductQuantity,
	increaseProductQuantity,
	deleteCart,
} from '../controller/cart.controller.js'
import { getTicketByEmail } from '../controller/ticket.controller.js'

const router = Router()

// Create a new cart
router.post('/', passportCall('jwt'), createCart)

// Delete a product from the cart
router.put('/:cid/:pid', passportCall('jwt'), deleteOneProductInCart)

// Get cart by ID
router.get('/:cid', passportCall('jwt'), getCartById)

// Decrease product quantity in the cart
router.put('/:cid/:pid/decrease', passportCall('jwt'), decreaseProductQuantity)

// Increase product quantity in the cart
router.put('/:cid/:pid/increase', passportCall('jwt'), increaseProductQuantity)

// Generate ticket for cart purchase
router.post('/:cid/purchase/', passportCall('jwt'), generateTicket)

// Get ticket by email
router.get('/:cid/finishpurchase/', passportCall('jwt'), getTicketByEmail)

// Update cart with a new product
router.post('/:cid/product/:pid', passportCall('jwt'), updateCart)

// Empty the cart
router.put('/:cid/', passportCall('jwt'), emptyCart)

// Delete a cart
router.delete('/:cid/', passportCall('jwt'), deleteCart)

export default router
