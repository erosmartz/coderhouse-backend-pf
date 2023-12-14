import { Router } from 'express'
import { signup } from '../controller/session.controller.js'

const router = Router()

// Route for signing up
router.get('', signup)

export default router
