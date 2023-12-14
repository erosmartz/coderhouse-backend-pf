import { Router } from 'express'
import { __filename, __dirname } from '../utils.js'
import { passportCall } from '../utils.js'
import { isUser } from './middlewares.routes.js'

const router = Router()

// Render the chat page
router.get('/', passportCall('jwt'), isUser, (req, res) => {
	res.render('chat', {})
})

export default router
