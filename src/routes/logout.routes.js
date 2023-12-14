import { Router } from 'express'
import { passportCall } from '../utils.js'
import { logoutSession } from '../controller/session.controller.js'

const router = Router()

// Route for logging out and ending the session
router.get('/', passportCall('jwt'), logoutSession)

export default router
