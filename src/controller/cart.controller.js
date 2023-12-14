import {
	cartService,
	productService,
	ticketService,
} from '../repositories/services.js'
import notifier from 'node-notifier'

// Create Cart: Creates a new cart based on the request body
const createCart = async (req, res) => {
	const cart = req.body
	try {
		await cartService.createCart(cart)
		res.send(cart)
	} catch (error) {
		res.status(500).json({ message: 'Error al crear el carrito' })
	}
}

// Get Cart by ID: Retrieves a cart by its ID and processes its details for rendering
const getCartById = async (req, res) => {
	const cid = req.params.cid
	try {
		// Retrieve the cart by ID from the service
		const cartById = await cartService.getCartById(cid)

		// If the cart is not found, return a 404 error
		if (!cartById) {
			return res.status(404).json({ message: 'Carrito no encontrado' })
		}

		// Modify the cart details for rendering purposes
		cartById._id = cartById._id.toString()
		const newCart = {
			_id: cartById._id,
			products: cartById.products.map((product) => ({
				_id: product.product._id,
				name: product.product.name,
				description: product.product.description,
				price: product.product.price,
				category: product.product.category,
				availability: product.product.availability,
				quantity: product.quantity,
			})),
			total: cartById.total,
		}

		// Check if the cart is empty
		const isEmptyCart = newCart.products.length === 0

		// Render the 'cart' view with the modified cart details
		res.render('cart', {
			cart: newCart,
			isEmptyCart,
		})
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener el carrito por ID' })
	}
}

// Update Cart by Adding a Product: Handles addition of a product to the cart
const updateCart = async (req, res) => {
	const cid = req.user.user.user.cart // User's cart ID
	const pid = req.params.pid // Product ID to be added to the cart
	const role = req.user.user.user.role // User's role
	const email = req.user.user.user.email // User's email

	try {
		// Retrieve product details by ID
		const product = await productService.getProductById(pid)

		// Check if the user has permission to add the product to the cart
		if (role === 'premium' && product.owner === email) {
			// Notify and return error for adding own product to the cart
			notifier.notify({
				title: 'Denied',
				message: 'You cannot add your own product to the cart',
				timeout: 1000,
			})
			return res.status(403).json({
				message: 'You cannot add your own product to the cart',
			})
		} else if (role === 'admin') {
			// Notify and return error for admin's inability to add products to the cart
			notifier.notify({
				title: 'Denied',
				message: 'You do not have permission to add products to the cart',
				timeout: 1000,
			})
			return res.status(403).json({
				message: 'You do not have permission to add products to the cart',
			})
		} else {
			// Check if the product is already in the cart
			const productInCart = await cartService.isProductInCart(cid, pid)

			// If product is already in the cart, increment its quantity
			if (productInCart) {
				await cartService.incrementProductQuantity(cid, pid)
			} else {
				// If product is not in the cart, add it
				await cartService.addProductToCart(cid, pid)
			}

			// Notify and return success message for adding the product to the cart
			notifier.notify({
				title: 'Success',
				message: 'Product added to the cart',
				timeout: 1000,
			})
			return res.status(200).json({ message: 'Product added to the cart' })
		}
	} catch (error) {
		// Return error if there's an issue adding the product to the cart
		return res.status(500).json({ message: 'Error adding product to the cart' })
	}
}

// Generate Ticket: Handles the creation of a ticket after purchase
const generateTicket = async (req, res) => {
	const user = req.user // User details
	const cid = req.params.cid // Cart ID

	try {
		// Retrieve cart details by its ID
		const cart = await cartService.getCartById(cid)

		// Generate a random ticket code
		const randomCode = getRandomInt(100000, 999999)

		// Create a new ticket object
		const newTicket = {
			code: randomCode,
			purchase_datetime: new Date(),
			amount: cart.total,
			purchaser: user.user.user.email, // User's email as purchaser
		}

		// Create the ticket using the ticket service
		const ticket = await ticketService.createTicket(newTicket)

		// Array to store products not purchased due to certain conditions
		const productsNotPurchased = []

		// Loop through each item in the cart's products
		for (const item of cart.products) {
			const productId = item.product // Product ID
			const quantity = item.quantity // Quantity of the product

			// Retrieve product details by its ID
			const product = await productService.getProductById(productId)

			// Check if the product exists
			if (!product) {
				// Add to productsNotPurchased array if the product is not found
				productsNotPurchased.push({
					productId,
					reason: 'Producto no encontrado',
				})
				continue
			}

			// Check if the available quantity is less than the requested quantity
			if (product.availability < quantity) {
				// Add to productsNotPurchased array if quantity is insufficient
				productsNotPurchased.push({
					productId,
					reason: 'Disponibilidad insuficiente',
				})
				continue
			}

			// Update the product's availability after purchase
			product.availability -= quantity
			await productService.updateProduct(productId, product)

			// Remove all instances of this product from the cart after purchase
			await cartService.removeAllProductsInCart(cid, product.id)
		}

		// Send the generated ticket as a response
		res.send(ticket)
	} catch (error) {
		// Return error if there's an issue generating the ticket
		res.status(500).json({ error: error.message })
	}
}

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

// Delete One Product from Cart: Removes a single product from the cart
const deleteOneProductInCart = async (req, res) => {
	const cid = req.params.cid // Cart ID
	const pid = req.params.pid // Product ID

	try {
		// Attempt to remove a single product from the cart
		const success = await cartService.removeOneProductInCart(cid, pid)

		if (success) {
			// If successful, return success message
			res.status(200).json({ message: 'Producto eliminado del carrito' })
		} else {
			// If the product is not found, return a 404 error
			res.status(404).json({ message: 'Producto no encontrado' })
		}
	} catch (err) {
		// Return an error if there's an issue removing the product from the cart
		res.status(500).json({
			message: 'Error al eliminar un producto del carrito',
			error: err,
		})
	}
}

// Empty Cart: Removes all products from the cart (empties the cart)
const emptyCart = async (req, res) => {
	const cid = req.params.cid // Cart ID

	try {
		// Retrieve the existing cart by its ID
		const existingCart = await cartService.getCartById(cid)

		if (!existingCart) {
			// If the cart is not found, return an error
			return res
				.status(500)
				.json({ message: 'Error no se encontro el carrito' })
		}

		// Remove all products from the cart
		await cartService.removeAllProductsInCart(cid)

		// Return a success message after emptying the cart
		return res.status(200).json({ message: 'Productos eliminados del carrito' })
	} catch (error) {
		// Return an error if there's an issue emptying the cart
		return res.status(500).json({
			message: 'No se pudieron eliminar los productos del carrito',
		})
	}
}

// Decrease Product Quantity: Reduces the quantity of a product in the cart by one
const decreaseProductQuantity = async (req, res) => {
	const cid = req.params.cid // Cart ID
	const pid = req.params.pid // Product ID

	try {
		// Decrease the quantity of the product in the cart
		const updatedCart = await cartService.decreaseQuantity(cid, pid)
		return res.status(200).json(updatedCart)
	} catch (error) {
		// Return an error if there's an issue decreasing the product quantity
		res.status(500).json({ error: error.message })
	}
}

// Increase Product Quantity: Increases the quantity of a product in the cart by one
const increaseProductQuantity = async (req, res) => {
	const cid = req.params.cid // Cart ID
	const pid = req.params.pid // Product ID

	try {
		// Increase the quantity of the product in the cart
		const updatedCart = await cartService.increaseQuantity(cid, pid)
		return res.status(200).json(updatedCart)
	} catch (error) {
		// Return an error if there's an issue increasing the product quantity
		res.status(500).json({ error: error.message })
	}
}

// Delete Cart: Deletes the entire cart
const deleteCart = async (req, res) => {
	const cid = req.params.cid // Cart ID

	try {
		// Retrieve the existing cart by its ID
		const existingCart = await cartService.getCartById(cid)

		if (!existingCart) {
			// If the cart is not found, throw an error
			throw new Error('Carrito no encontrado')
		}

		// Delete the cart
		await cartService.deleteCart(cid)
	} catch (error) {
		// Return an error if there's an issue deleting the cart
		return res.status(500).json({ message: 'No se pudo eliminar el carrito' })
	}
}

export {
	createCart,
	getCartById,
	updateCart,
	generateTicket,
	emptyCart,
	deleteOneProductInCart,
	decreaseProductQuantity,
	increaseProductQuantity,
	deleteCart,
}
