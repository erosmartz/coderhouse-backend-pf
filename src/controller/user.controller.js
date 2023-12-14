import { userService } from '../repositories/services.js'
import UserRepository from '../repositories/user.repository.js'
import { createUserDTO } from '../DTO/userDTO.js'
import notifier from 'node-notifier'

const userRepository = new UserRepository()

// Save User: Creates a new user
const saveUser = async (req, res) => {
	const { first_name, last_name, email, age, password } = req.body

	// Validate required fields
	if (!first_name || !last_name || !email || !age || !password) {
		return res.status(400).json({
			status: 'error',
			error: 'Incomplete values',
		})
	}

	try {
		// Create a new user object
		const newUser = new User({
			first_name,
			last_name,
			email,
			age,
			password,
		})

		// Create an empty cart for the new user
		const newCart = new Cart()
		await newCart.save()
		newUser.cart = newCart._id

		// Set the default role as 'user'
		newUser.role = 'user'

		// Create the user using the userService
		const createdUser = await userService.createUser(newUser)

		res.status(201).json({
			status: 'success',
			message: 'Usuario creado exitosamente',
			user: createdUser,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			status: 'error',
			error: 'No se pudo crear el usuario',
		})
	}
}

// Get All Users: Retrieves all users
const getAllUsers = async (req, res) => {
	try {
		// Retrieve all users
		const allUsers = await userService.getAllUsers()

		// Map user data to userDTO format
		const userDTOs = allUsers.map((users) => createUserDTO(users))

		// Render 'all-users' view with user data in DTO format
		res.render('all-users', { users: userDTOs })
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error al obtener usuarios', error: error.message })
	}
}

/* const getAllUsers = async (req, res) => {
	try {
		const userDTOs = await userRepository.getAllUsersWithDTO()
		res.render('all-users', { users: userDTOs })
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error al obtener usuarios', error: error.message })
	}
} */

/// Get User by ID: Retrieves a user by their ID
const getUserById = async (req, res) => {
	const uid = req.params.uid // User ID from request
	const userId = await userService.getUserById(uid) // Retrieve user by ID
	res.send(userId) // Send retrieved user data as a response
}

// Get User by ID for Role Change: Retrieves a user by ID for role change purposes
const getUserForChange = async (req, res) => {
	const uid = req.params.uid // User ID from request
	const userId = await userService.getUserById(uid) // Retrieve user by ID
	const users = await userService.getAllUsers() // Retrieve all users
	res.render('edit-users', { userId: userId, users: users }) // Render 'edit-users' view with user and all users' data
}

// Change User Role: Changes the role of a user based on specified new role
const changeRoleUser = async (req, res) => {
	const uid = req.params.uid // User ID from request
	const { newRole } = req.body // New role data from request

	// Get user's information regarding document upload
	const user = await userService.getUserById(uid)

	// Check the existence of required documents
	const requiredDocuments = ['identification', 'addressProof', 'bankStatement']
	const hasRequiredDocuments = requiredDocuments.every((documentType) =>
		user.documents.some((document) => document.name === documentType)
	)

	if (hasRequiredDocuments) {
		// Change user's role only if required documents are uploaded
		const updatedUser = await userService.updateUser(uid, newRole)
		notifier.notify({
			title: 'Exito',
			message: 'Rol modificado',
		})
		res.send(updatedUser)
	} else {
		notifier.notify({
			title: 'Error',
			message: 'El usuario debe cargar los documentos',
		})
	}
}

// Get User by Email: Retrieves a user by their email
const getUserByEmail = async (req, res) => {
	const email = req.params.userEmail // User email from request
	const userId = await userService.getUserIdByEmail(email) // Retrieve user by email
	res.send(userId) // Send retrieved user data as a response
}

// Go to Document Upload Route: Renders the 'up-document' view with user data
const goUpDocument = async (req, res) => {
	const uid = req.params.uid // User ID from request
	const userId = await userService.getUserById(uid) // Retrieve user by ID
	res.render('up-document', { userId }) // Render 'up-document' view with user data
}

// Upload Profile Image with Multer: Saves the profile image using multer
const uploadProfileUser = async (req, res) => {
	try {
		const userId = req.params.uid // User ID from request
		const imagePath = req.file.path // Image path from multer upload
		await userService.uploadProfileUser(userId, imagePath) // Save the profile image for the user

		notifier.notify({
			title: 'Nuevo Avatar',
			message: 'Tu perfil ha sido actualizado.',
		})
		res.redirect(303, `/api/users/${userId}/profile`) // Redirect to the user's profile route
	} catch (error) {
		res.status(500).json({
			error: 'Error interno del servidor al subir la imagen',
		})
	}
}

// Upload Documents with Multer: Handles document upload using Multer
const uploadDocumentUser = async (req, res) => {
	try {
		const userId = req.params.uid // User ID from request
		const documentType = req.body.documentType // Document type from request

		// Check if file is uploaded
		if (!req.file) {
			return res
				.status(400)
				.json({ error: 'Por favor, selecciona un archivo.' })
		}

		const filePath = req.file.path // File path from multer upload
		await userService.uploadDocument(userId, documentType, filePath) // Save the document for the user

		notifier.notify({
			title: 'Documento subido',
			message: 'Tu documento fue subido correctamente',
		})

		res.redirect(303, `/api/users/${userId}/profile`) // Redirect to the user's profile route
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Error interno del servidor al subir el archivo.' })
	}
}

// Get Profile: Retrieves user profile information
const getProfile = async (req, res) => {
	const userId = req.params.uid // User ID from request
	const profile = await userService.getUserById(userId) // Retrieve user profile by ID
	res.render('profile', profile) // Render 'profile' view with user profile data
}

// Delete User: Deletes a user by ID
const deleteUser = async (req, res) => {
	const userId = req.params.uid // User ID from request
	await userService.deleteUser(userId) // Delete the user by ID

	notifier.notify({
		title: 'Exito',
		message: 'Usuario eliminado',
	})

	return
}

export {
	saveUser,
	getAllUsers,
	getUserById,
	changeRoleUser,
	getUserForChange,
	getUserByEmail,
	goUpDocument,
	uploadDocumentUser,
	getProfile,
	uploadProfileUser,
	deleteUser,
}
