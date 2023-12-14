import { __dirname } from '../utils.js'

// Authorization middleware for administrators
export function isAdmin(req, res, next) {
	if (req.user && req.user.user.user.role == 'admin') {
		next() // User is an admin, allow access
	} else {
		res.status(403).json({ message: 'Unauthorized access' })
	}
}

// Authorization middleware for premium users
export function isPremium(req, res, next) {
	if (req.user && req.user.user.user.role == 'premium') {
		next() // User is a premium user, allow access
	} else {
		res.status(403).json({ message: 'Unauthorized access' })
	}
}

// Authorization middleware for regular users
export function isUser(req, res, next) {
	if (req.user && req.user.user.user.role == 'user') {
		next() // User is a regular user, allow access
	} else {
		res.status(403).json({ message: 'Unauthorized access' })
	}
}
