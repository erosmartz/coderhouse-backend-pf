import { fileURLToPath } from 'url'
import { dirname } from 'path'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

import config from './config/config.js'

const COOKIE_SECRET = config.jwt.SECRET

// Get the current filename and dirname
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// Generate a JWT token for the user
export const generateToken = (user) => {
	const token = jwt.sign({ user }, COOKIE_SECRET, { expiresIn: '2h' })
	return token
}

// Middleware to authenticate the request using JWT token
export const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader) {
		res.status(401).json({ error: 'Authentication error' })
	}

	jwt.verify(authHeader, COOKIE_SECRET, (err, user) => {
		if (err) {
			res.status(401).json({ error: 'Invalid token' })
		}

		req.user = user
		next()
	})
}

// Passport authentication middleware
export const passportCall = (strategy) => {
	return async (req, res, next) => {
		passport.authenticate(strategy, (error, user, info) => {
			if (error) {
				return next(error) // Handle authentication errors
			}

			if (!user) {
				if (info && info.message) {
					return res
						.status(401)
						.json({ status: 'error', message: info.message })
				} else {
					return res
						.status(401)
						.json({ status: 'error', message: 'Unauthorized' })
				}
			}

			req.user = user // Assign the user to req.user
			next()
		})(req, res, next)
	}
}

// Authorization middleware to check if the user is an admin
export const authorization = () => {
	return async (req, res, next) => {
		if (req.session.user && req.session.user.role.admin) {
			return next()
		} else {
			return res.status(403).json('Authentication error')
		}
	}
}

// Function to hash the password
export const createHash = (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Function to compare the raw password with the hashed password from the database
export const isValidPassword = (savedPassword, password) => {
	console.log({ 'stored password': savedPassword, loginPassword: password })
	return bcrypt.compareSync(password, savedPassword)
}

// Function to generate a mock product
export const generateProductMocks = () => {
	return {
		name: faker.commerce.productName(),
		description: faker.lorem.sentence(),
		price: faker.datatype.number({ min: 10, max: 1000, precision: 0.01 }),
		category: faker.commerce.department(),
		availability: faker.datatype.number({ min: 0, max: 100 }),
	}
}
