import productsModel from '../models/product.model.js'

export default class ProductDao {
	constructor() {
		console.log(`Working with Database persistence for users in MongoDB`)
	}

	// Create a new product
	create = async (product) => {
		try {
			const newProduct = await productsModel.create(product)
			return newProduct
		} catch (error) {
			throw new Error('Error creating the product: ' + error.message)
		}
	}

	// Get all products
	getAll = async () => {
		try {
			let products = await productsModel.find({}).lean()
			return products
		} catch (error) {
			throw new Error('Error getting all products: ' + error.message)
		}
	}

	// Get paginated products
	getPagination = async (page, perPage) => {
		try {
			const totalProducts = await productsModel.countDocuments()
			const totalPages = Math.ceil(totalProducts / perPage)

			const products = await productsModel
				.find()
				.lean()
				.skip((page - 1) * perPage)
				.limit(perPage)
				.exec()

			return { products, totalPages }
		} catch (error) {
			throw new Error(`Error getting paginated products: ${error.message}`)
		}
	}

	// Get product by ID
	getById = async (pid) => {
		try {
			let productId = await productsModel.findById(pid)
			return productId
		} catch (error) {
			throw new Error('Error getting the product: ' + error.message)
		}
	}

	// Update a product
	update = async (pid, product) => {
		try {
			const updatedProduct = await productsModel.findByIdAndUpdate(
				pid,
				product,
				{ new: true }
			)
			return updatedProduct
		} catch (error) {
			throw new Error('Error updating the product: ' + error.message)
		}
	}

	// Upload product image
	upImage = async (pid, imagePath) => {
		try {
			const product = await productsModel.findById(pid)
			if (!product) {
				throw new Error('Product not found')
			}
			product.productImage = imagePath
			await product.save()

			return { message: 'Image path updated successfully in the database' }
		} catch (error) {
			throw new Error('Error uploading image: ' + error.message)
		}
	}

	// Delete a product
	delete = async (pid) => {
		try {
			const deletedProduct = await productsModel.findByIdAndDelete(pid)
			return deletedProduct
		} catch (error) {
			throw new Error('Error deleting the product: ' + error.message)
		}
	}
}
