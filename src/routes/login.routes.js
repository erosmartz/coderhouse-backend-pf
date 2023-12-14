import { Router } from 'express'
import { login } from '../controller/session.controller.js'

const router = Router()

// Route for handling login request
router.get('', login)

export default router
