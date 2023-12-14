import { Router } from 'express'
import { __dirname } from '../utils.js'
import { passportCall } from '../utils.js'
import {
	getAllProducts,
	getProductById,
} from '../controller/product.controller.js'

const router = Router()

// Route for getting all products
router.get('/', passportCall('jwt'), getAllProducts)

// Route for getting a product by ID
router.get('/:pid', passportCall('jwt'), getProductById)

export default router
