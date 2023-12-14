import { Router } from 'express'
import multer from 'multer'
import {
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
} from '../controller/user.controller.js'
import { passportCall } from '../utils.js'
import { isAdmin } from './middlewares.routes.js'
import { uploadProfileImage, uploadDocument } from '../config/multer.config.js'

const router = Router()

// Multer configuration to handle file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Route for getting all users (admin only)
router.get('/', passportCall('jwt'), isAdmin, getAllUsers)

// Route for saving a user (admin only)
router.post('/', passportCall('jwt'), isAdmin, saveUser)

// Route for getting a user by ID (admin only)
router.get('/:uid', passportCall('jwt'), isAdmin, getUserById)

// Route for deleting a user by ID (admin only)
router.delete('/:uid', passportCall('jwt'), isAdmin, deleteUser)

// Route for getting a user for role change (admin only)
router.get('/admin/:uid', passportCall('jwt'), isAdmin, getUserForChange)

// Route for changing a user's role (admin only)
router.post('/admin/:uid', passportCall('jwt'), isAdmin, changeRoleUser)

// Route for getting a user by email (admin only)
router.get('/byemail/:userEmail', passportCall('jwt'), isAdmin, getUserByEmail)

// Route for getting user documents (admin only)
router.get('/:uid/documents', passportCall('jwt'), goUpDocument)

// Route for getting user profile (admin only)
router.get('/:uid/profile/', passportCall('jwt'), getProfile)

// Route for uploading user avatar (admin only)
router.post(
	'/:uid/upload-avatar/',
	passportCall('jwt'),
	uploadProfileImage.single('profiles'),
	uploadProfileUser
)

// Route for uploading user documents (admin only)
router.post(
	'/:uid/upload-documents/',
	passportCall('jwt'),
	uploadDocument.single('documents'),
	uploadDocumentUser
)

export default router
