import { productService, userService } from '../repositories/services.js'
import { sendEmailToPremium } from '../services/mailing.js'
import notifier from 'node-notifier'

// Create Product: Handles the creation of a new product
const createProduct = async (req, res) => {
	const productData = req.body // Product data from the request body
	const user = req.user // User details

	try {
		// Validate product data
		if (
			!productData ||
			!productData.name ||
			!productData.description ||
			!productData.price ||
			!productData.category ||
			!productData.availability
		) {
			throw new CustomError(
				EErrors.InvalidData,
				'Los datos del producto son inválidos.'
			)
		}

		// Assign owner to the product (using user's email)
		productData.owner = user.user.user.email

		// Create the product using productService
		await productService.createProduct(productData)
		res.send(productData)
	} catch (error) {
		res.status(500).json({ message: 'Error al crear el producto.' })
	}
}

// Get All Products: Retrieves all products for pagination and rendering
const getAllProducts = async (req, res) => {
	const user = req.user // User details
	const cartId = req.user.user.user.cart // User's cart ID
	const userRole = user.user.user.role // User's role
	const userId = req.user.user.user._id // User ID

	try {
		// Retrieve user profile details
		const profile = await userService.getUserById(userId)
		const showAvatar = profile.profileImage

		// Determine visibility for certain features based on user's role
		const showEditProduct = userRole === 'admin' || userRole === 'premium'
		const showChangeRole = userRole === 'admin'

		// Pagination settings
		const page = parseInt(req.query.page) || 1
		const perPage = 8

		// Retrieve paginated products and total pages
		const { products, totalPages } =
			await productService.getAllProductsForPagination(page, perPage)

		// Render the 'home' view with product data and user-related information
		res.render('home', {
			products,
			user,
			cartId,
			showEditProduct,
			showAvatar,
			showChangeRole,
			pagination: {
				currentPage: page,
				totalPages,
				hasPrevPage: page > 1,
				hasNextPage: page < totalPages,
				prevLink: page > 1 ? `/api/products?page=${page - 1}` : null,
				nextLink: page < totalPages ? `/api/products?page=${page + 1}` : null,
			},
		})
	} catch (error) {
		res.status(500).json({ message: 'Error al ir a home.' })
	}
}

// Get Product by ID: Retrieves a product by its ID for rendering
const getProductById = async (req, res) => {
	const pid = req.params.pid // Product ID

	try {
		// Retrieve product details by its ID
		const productById = await productService.getProductById(pid)
		productById._id = productById._id.toString()

		// Render the 'product-detail' view with the product details
		res.render('product-detail', productById)
	} catch (error) {
		res.status(500).json({ message: 'Error obtener un producto.' })
	}
}

// Get All Products for Admin: Retrieves all products to display for admin
const getAllProductsForAdmin = async (req, res) => {
	const user = req.user // User details

	try {
		// Retrieve all products
		const products = await productService.getAllProducts()

		// Render the 'update-products' view with product data for the admin
		res.render('update-products', { products: products, user: user })
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener los productos.' })
	}
}

// Get Product by ID for Admin: Retrieves a product by its ID to display for admin
const getProductByIdForAdmin = async (req, res) => {
	const pid = req.params.pid // Product ID

	try {
		// Retrieve product details by its ID
		const productById = await productService.getProductById(pid)
		productById._id = productById._id.toString()

		// Render the 'update-one-product' view with the product details for admin
		res.render('update-one-product', productById)
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener el producto.' })
	}
}

// Update Product: Updates a product's details
const updateProduct = async (req, res) => {
	const pid = req.params.pid // Product ID to update
	const productToUpdated = req.body // Updated product data

	try {
		// Update the product using productService
		const productUpdated = await productService.updateProduct(
			pid,
			productToUpdated
		)

		// Notify on successful update
		notifier.notify({
			title: 'Exito',
			message: 'Producto actualizado',
		})

		// Send the updated product as a response
		res.send(productUpdated)
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar el producto.' })
	}
}

// Upload Image of a Product: Saves the image path of a product
const uploadImageProduct = async (req, res) => {
	try {
		const productId = req.params.pid // Product ID
		const imagePath = req.file.path // Path of the uploaded image

		// Upload the image for the specified product
		await productService.uploadImageProduct(productId, imagePath)

		// Notify on successful image upload
		notifier.notify({
			title: 'Imagen del producto',
			message: 'Tu imagen fue agregada al producto',
		})

		// Redirect to update products page after image upload
		res.redirect(303, `/api/updateproducts`)
	} catch (error) {
		res.status(500).json({
			error: 'Error interno del servidor al subir la imagen de producto',
		})
	}
}

// Delete Product: Handles the deletion of a product
const deleteProduct = async (req, res) => {
	const { pid } = req.params // Product ID to delete
	const { user } = req // User details

	try {
		// Retrieve product details by its ID
		const product = await productService.getProductById(pid)

		// Check user permissions for deleting the product
		if (
			user.user.user.role === 'admin' ||
			(user.user.user.role === 'premium' &&
				product.owner === user.user.user.email)
		) {
			// Delete the product using productService
			const productDeleted = await productService.deleteProduct(pid)

			// Notify admin about the product deletion if performed by an admin for a different user's product
			if (
				user.user.user.role === 'admin' &&
				product.owner !== user.user.user.email
			) {
				await sendEmailToPremium(product.owner)
				console.log(
					`Correo enviado a ${product.owner} sobre la eliminación del producto.`
				)
			}

			// Notify on successful deletion
			notifier.notify({
				title: 'Exito',
				message: 'Producto eliminado.',
			})

			// Send the deleted product as a response
			res.send(productDeleted)
		} else {
			// Notify if the user doesn't have permission to delete the product
			notifier.notify({
				title: 'Permiso denegado',
				message: 'No tienes permiso para eliminar este producto.',
			})
		}
	} catch (error) {
		console.error(error)
		res.status(500).send('Error interno del servidor.')
	}
}

export {
	createProduct,
	getAllProducts,
	getProductById,
	deleteProduct,
	updateProduct,
	getAllProductsForAdmin,
	getProductByIdForAdmin,
	uploadImageProduct,
}
