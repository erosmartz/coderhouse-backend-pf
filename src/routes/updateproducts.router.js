import { Router } from 'express'
import { passportCall } from '../utils.js'
import { uploadProductImage } from '../config/multer.config.js'
import {
	getAllProductsForAdmin,
	createProduct,
	deleteProduct,
	updateProduct,
	getProductByIdForAdmin,
	uploadImageProduct,
} from '../controller/product.controller.js'

const router = Router()

// Route for getting all products for admin
router.get('/', passportCall('jwt'), getAllProductsForAdmin)

// Route for creating a product
router.post('/', passportCall('jwt'), createProduct)

// Route for deleting a product by ID
router.delete('/:pid', passportCall('jwt'), deleteProduct)

// Route for getting a product by ID for admin
router.get('/:pid', passportCall('jwt'), getProductByIdForAdmin)

// Route for updating a product by ID
router.put('/:pid', passportCall('jwt'), updateProduct)

// Route for uploading an image for a product
router.post('/:pid', uploadProductImage.single('products'), uploadImageProduct)

export default router
