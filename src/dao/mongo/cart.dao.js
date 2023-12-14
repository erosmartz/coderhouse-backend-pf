import CartModel from '../models/cart.model.js'

export default class CartDao {
	constructor() {
		console.log(`Initializing Database persistence for MongoDB`)
	}

	// Create Cart
	create = async (data) => {
		try {
			// Creating a new cart using provided data
			const newCart = await CartModel.create(data)
			return newCart
		} catch (error) {
			// Handling error during cart creation
			throw new Error('Error creating the cart: ' + error.message)
		}
	}

	// Get Cart by ID
	getById = async (cartId) => {
		try {
			// Finding a cart by its ID
			const result = await CartModel.findById({ _id: cartId })
			return result
		} catch (error) {
			// Handling error while retrieving the cart
			throw new Error('Error getting the cart: ' + error.message)
		}
	}

	// Add Product to Cart
	addProduct = async (cartId, productId) => {
		try {
			// Finding the cart by its ID
			const cart = await CartModel.findOne({ _id: cartId })

			// Checking if the product already exists in the cart
			const productExists = cart.products.some(
				(p) => String(p.product) === productId
			)

			if (!productExists) {
				// If the product does not exist, add it to the cart
				const newProduct = { product: productId, quantity: 1 }
				cart.products.push(newProduct)
				const updatedCart = await cart.save()

				if (!updatedCart) {
					return null
				}
				return updatedCart
			}
		} catch (error) {
			// Handling error while adding a product to the cart
			throw new Error('Error adding the product to the cart: ' + error.message)
		}
	}

	// Check if Product Exists in Cart
	isThere = async (cartId, productId) => {
		try {
			// Finding the cart by its ID
			const cart = await CartModel.findOne({ _id: cartId })

			if (cart) {
				// Checking if the product exists in the cart
				const productInCart = cart.products.some(
					({ product }) => String(product._id) === productId
				)

				if (productInCart) {
					return productInCart
				} else {
					return null
				}
			} else {
				return null
			}
		} catch (error) {
			// Handling error while checking product existence in the cart
			throw new Error(
				'Error checking the product in the cart: ' + error.message
			)
		}
	}

	// Increment quantity by one if the product is in the cart
	incrementQuantity = async (cartId, productId) => {
		try {
			// Finding the cart by its ID
			const cart = await CartModel.findOne({ _id: cartId })

			// Finding the index of the product in the cart
			const productIndex = cart.products.findIndex(
				(p) => String(p.product._id) === productId
			)

			if (productIndex !== -1) {
				// Incrementing the quantity by one
				cart.products[productIndex].quantity += 1
				const updatedCart = await cart.save()

				if (!updatedCart) {
					return null
				}
				return updatedCart
			} else {
				return null
			}
		} catch (error) {
			// Handling error while incrementing the quantity
			throw new Error(
				'Error incrementing the product quantity in the cart: ' + error.message
			)
		}
	}

	// Remove one instance of a product from the cart
	removeOneProduct = async (cartId, productId) => {
		try {
			// Finding the cart by its ID
			const cart = await CartModel.findOne({ _id: cartId })

			// Filtering out the product to remove from the cart
			const updatedProducts = cart.products.filter(
				(p) => String(p.product._id) !== productId
			)
			cart.products = updatedProducts
			const updatedCart = await cart.save()

			if (!updatedCart) {
				return null
			}
			return updatedCart
		} catch (error) {
			// Handling error while removing a product from the cart
			throw new Error(
				'Error removing the product from the cart: ' + error.message
			)
		}
	}

	// Remove all products from the cart - Empty Cart
	removeAllProducts = async (cartId) => {
		try {
			// Finding the cart by its ID
			const cart = await CartModel.findById(cartId)
			if (!cart) {
				throw new Error('Cart not found')
			}

			// Emptying the products array in the cart
			cart.products = []
			await cart.save()

			return cart
		} catch (error) {
			// Handling error while emptying the cart
			throw new Error(
				'Error removing all products from the cart: ' + error.message
			)
		}
	}

	// Increase the quantity of a product in the cart
	increase = async (cartId, productId) => {
		try {
			// Finding the cart by its ID
			const cart = await CartModel.findOne({ _id: cartId })
			if (!cart) {
				throw new Error('Cart not found')
			}

			// Finding the index of the product in the cart
			const productIndex = cart.products.findIndex(
				(p) => String(p.product._id) === productId
			)
			if (productIndex !== -1) {
				// Incrementing the quantity by one
				cart.products[productIndex].quantity += 1

				const updatedCart = await cart.save()
				return updatedCart
			} else {
				throw new Error('Product not found in the cart')
			}
		} catch (error) {
			// Handling error while increasing the quantity of the product
			throw new Error(`Error increasing the product quantity: ${error.message}`)
		}
	}

	// Decrease the quantity of a product in the cart
	decrease = async (cartId, productId) => {
		try {
			// Finding the cart by its ID
			const cart = await CartModel.findOne({ _id: cartId })
			if (!cart) {
				throw new Error('Cart not found')
			}

			// Finding the index of the product in the cart
			const productIndex = cart.products.findIndex(
				(p) => String(p.product._id) === productId
			)
			if (productIndex !== -1) {
				if (cart.products[productIndex].quantity > 1) {
					// Decreasing the quantity by one if greater than 1
					cart.products[productIndex].quantity -= 1
				} else {
					// If the quantity is 1, remove the product from the cart
					cart.products.splice(productIndex, 1)
				}

				const updatedCart = await cart.save()
				return updatedCart
			} else {
				throw new Error('Product not found in the cart')
			}
		} catch (error) {
			// Handling error while decreasing the quantity of the product
			throw new Error(`Error decreasing the product quantity: ${error.message}`)
		}
	}

	// Delete a cart by its ID
	delete = async (cartId) => {
		try {
			// Finding and deleting the cart by its ID
			const deletedCart = await CartModel.findByIdAndDelete(cartId)
			return deletedCart
		} catch (error) {
			// Handling error while deleting the cart
			throw new Error('Error deleting the cart: ' + error.message)
		}
	}
}
