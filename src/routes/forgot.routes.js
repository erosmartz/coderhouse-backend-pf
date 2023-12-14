import { Router } from 'express'
import { forgotPassword } from '../controller/session.controller.js'

const router = Router()

// Route for handling password reset request
router.get('', forgotPassword)

export default router
