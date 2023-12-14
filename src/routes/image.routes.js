import { Router } from 'express'
import { passportCall } from '../utils.js'
import { logoutSession } from '../controller/session.controller.js'

const router = Router()

// Route for logging out and ending the session
router.get('/', passportCall('jwt'), async (req, res) => {
	// Extra logic should go here
	res.send()
})

export default router
