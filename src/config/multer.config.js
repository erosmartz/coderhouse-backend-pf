import multer from 'multer'
import { __dirname } from '../utils.js'

// Define the storage function that determines the destination folder
function storage(folderName) {
	return multer.diskStorage({
		destination: function (req, file, cb) {
			// Set the upload path based on the folderName parameter
			let uploadPath
			if (folderName === 'profiles') {
				uploadPath = './public/upload/profiles/'
			} else if (folderName === 'products') {
				uploadPath = './public/upload/products/'
			} else if (folderName === 'documents') {
				uploadPath = './public/upload/documents/'
			} else {
				cb(new Error('Invalid file type'))
				return
			}
			cb(null, uploadPath)
		},
		filename: function (req, file, cb) {
			let uniqueFilename
			const userId = req.params.uid
			const documentType = req.body.documentType

			// Set the filename based on the folderName parameter
			if (folderName === 'products') {
				uniqueFilename = `${userId}_${file.originalname}`
			} else {
				uniqueFilename = `${userId}_${documentType}_${file.originalname}`
			}

			cb(null, uniqueFilename)
		},
	})
}

// Configure multer to upload different types of files to different folders
export const uploadProfileImage = multer({ storage: storage('profiles') })
export const uploadProductImage = multer({ storage: storage('products') })
export const uploadDocument = multer({ storage: storage('documents') })
