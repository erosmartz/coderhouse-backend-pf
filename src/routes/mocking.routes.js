import { Router } from 'express'
import { __filename, __dirname } from '../utils.js'
import { generateProductMocks } from '../utils.js'

const router = Router()

router.get('/', (req, res) => {
	// Generate mock products
	const products = []
	for (let i = 0; i < 100; i++) {
		products.push(generateProductMocks())
	} // Render the mocking page with the generated products

	res.render('mocking', { products })
})

export default router
