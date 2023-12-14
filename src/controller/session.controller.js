import { cartService, userService } from '../repositories/services.js'
import { generateToken } from '../utils.js'
import { __dirname } from '../utils.js'
import notifier from 'node-notifier'
import config from '../config/config.js'

const COOKIE_NAME = config.jwt.NAME

// Signup: Renders the signup form
const signup = async (req, res) => {
	res.render('signup', {
		title: 'Crea tu cuenta',
	})
}

// Session Login: Handles user login
const sessionLogin = async (req, res) => {
	const { username, password } = req.body
	try {
		// Check if the user exists
		const user = await userService.getDataUserByEmail(username)

		if (!user) {
			// Notify if user not found
			notifier.notify({
				title: 'Acceso denegado',
				message: 'Registrese para ingresar',
				timeout: 1000,
			})
			return res.json({ status: 'error', message: 'User not found' })
		} else {
			const cart = []

			// Create an empty cart for the user
			const newCart = await cartService.createCart({ products: cart })

			// Update user's last connection and cart ID
			user.last_connection = new Date()
			user.cart = newCart._id
			await userService.updateIdCartInUser(user)

			// Generate token for authentication
			const myToken = generateToken({ user, cart })

			// Set the authentication token as a cookie
			res
				.cookie(COOKIE_NAME, myToken, {
					maxAge: 60 * 60 * 1000,
					httpOnly: true,
				})
				.json({
					status: 'success',
					respuesta: 'Autenticado exitosamente',
					token: myToken,
				})
		}
	} catch (error) {
		console.error(error)
		res
			.status(500)
			.json({ status: 'error', message: 'Error al iniciar sesión' })
	}
}

// Login: Renders the login form
const login = async (req, res) => {
	res.render('login', {
		title: 'Inicia sesion',
	})
}

// Forgot Password: Renders the forgot password form
const forgotPassword = async (req, res) => {
	res.render('forgot', {
		title: 'Olvidaste tu contrasena?',
	})
}

// Logout Session: Handles user logout
const logoutSession = async (req, res) => {
	try {
		const cartId = req.user.user.user.cart // User's cart ID
		const user = req.user // User details

		// Update user's last connection timestamp
		user.last_connection = new Date()
		await userService.updateUser()

		// Delete the user's shopping cart
		await cartService.deleteCart(cartId)

		// Destroy the session and clear cookies on successful logout
		req.session.destroy((err) => {
			if (err) {
				console.error('Error al cerrar sesión:', err)
				return res.status(500).json({ respuesta: 'Error en el servidor' })
			} else {
				// Clear the authentication token and redirect to home page after logout
				res.clearCookie(COOKIE_NAME)
				res.redirect('/')
			}
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ status: 'error', message: 'Error al cerrar sesión' })
	}
}

export { signup, login, sessionLogin, forgotPassword, logoutSession }
