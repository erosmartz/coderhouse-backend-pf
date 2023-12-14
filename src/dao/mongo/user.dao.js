import userModel from '../models/user.model.js'

export default class Users {
	constructor() {
		console.log(`Working with Database persistence for users in MongoDB`)
	}

	// Create a new user
	create = async (user) => {
		try {
			let result = await userModel.create(user)
			return result
		} catch (error) {
			throw new Error('Error creating user: ' + error.message)
		}
	}

	// Get all users
	getAll = async () => {
		try {
			let users = await userModel.find().lean()
			return users
		} catch (error) {
			throw new Error('Error getting all users: ' + error.message)
		}
	}

	// Get a user by their ID
	getById = async (uid) => {
		try {
			let result = await userModel.findById(uid)
			return result
		} catch (error) {
			throw new Error('Error getting user by ID: ' + error.message)
		}
	}

	// Get a user's ID by their email
	getByIdFromEmail = async (email) => {
		try {
			const user = await userModel.findOne({ email: email })
			if (user) {
				return user._id
			} else {
				return null
			}
		} catch (error) {
			throw new Error('Error getting user ID by email: ' + error.message)
		}
	}

	// Get all user data by their email
	getDataByEmail = async (email) => {
		try {
			const user = await userModel.findOne({ email: email })
			return user || null
		} catch (error) {
			throw new Error('Error getting user by email: ' + error.message)
		}
	}

	// Update the user's cart ID
	updateIdCart = async (user) => {
		try {
			await userModel.findByIdAndUpdate(user._id, user, { new: true })
			return user // Returns the updated user
		} catch (error) {
			throw new Error(`Error updating user: ${error.message}`)
		}
	}

	// Update a user - Change role
	update = async (uid, newRole) => {
		try {
			const result = await userModel.findByIdAndUpdate(uid, { role: newRole })
			return result
		} catch (error) {
			throw new Error('Error changing user role: ' + error.message)
		}
	}

	// Upload user's profile image
	upAvatar = async (uid, imagePath) => {
		try {
			const user = await userModel.findById(uid)
			if (!user) {
				throw new Error('User not found')
			}
			user.profileImage = imagePath
			await user.save()

			return { message: 'Image path updated successfully in the database' }
		} catch (error) {
			throw new Error('Error uploading profile picture: ' + error.message)
		}
	}

	// Upload user's documents
	upDocument = async (uid, documentType, filePath) => {
		try {
			const user = await userModel.findById(uid)
			if (!user) {
				throw new Error('User not found')
			}
			user.documents.push({
				name: documentType,
				reference: filePath,
			})
			await user.save()

			return { success: true }
		} catch (error) {
			throw new Error('Error uploading document: ' + error.message)
		}
	}

	// Delete a user
	delete = async (uid) => {
		try {
			let userDeleted = await userModel.findByIdAndDelete(uid)
			return userDeleted
		} catch (error) {
			throw new Error('Error deleting user: ' + error.message)
		}
	}
}
