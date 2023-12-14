import { Router } from 'express'
import { sessionLogin } from '../controller/session.controller.js'
import passport from 'passport'
import userModel from '../dao/models/user.model.js'
import { createHash } from '../utils.js'

const router = Router()

// API/Session Routes
router.post('/login', sessionLogin)

// Route for resetting password
router.post('/forgot', async (req, res) => {
	const { username, newPassword } = req.body

	const result = await userModel.find({
		email: username,
	})
	if (result.length === 0)
		return res.status(401).json({
			response: 'User does not exist',
		})
	else {
		const response = await userModel.findByIdAndUpdate(result[0]._id, {
			password: createHash(newPassword),
		})
		console.log(response)
		res.status(200).json({
			response: 'Password changed',
			data: response,
		})
	}
})

// Route for signing up and handling failed registrations using passport
router.post(
	'/signup',
	passport.authenticate('register', {
		failureRedirect: '/failRegister',
	}),
	async (req, res) => {
		res.status(200).json({ response: 'ok' })
	}
)

router.get('/failRegister', async (req, res) => {
	console.log('failed strategy')
	res.send({ error: 'failed' })
})

// Route for registering with GitHub
router.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	async (req, res) => {}
)

router.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/' }),
	async (req, res) => {
		req.session.user = req.user
		req.session.admin = true
		res.redirect('/api/products')
	}
)

export default router
