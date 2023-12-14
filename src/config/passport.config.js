import passport from 'passport'
import local from 'passport-local'

import UserModel from '../dao/models/user.model.js'
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword } from '../utils.js'

import jwt, { ExtractJwt } from 'passport-jwt'
import * as dotenv from 'dotenv'

import config from './config.js'

dotenv.config()
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

// Get GitHub credentials from config
const GITHUB_CLIENT_ID = config.github.CLIENT_ID
const GITHUB_CLIENT_SECRET = config.github.CLIENT_SECRET
const GITHUB_CALLBACK_URL = config.github.CALLBACK_URL

// Get JWT credentials from config
const COOKIE_NAME = config.jwt.NAME
const COOKIE_SECRET = config.jwt.SECRET

// Extract JWT token from cookie
export const cookieExtractor = (req) => {
	let token = null
	if (req && req.cookies) {
		token = req.cookies[COOKIE_NAME]
	}
	return token
}

const initializePassport = () => {
	passport.use(
		'jwt',
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
				secretOrKey: COOKIE_SECRET,
			},
			async (jwt_payload, done) => {
				try {
					let response = await UserModel.find({
						email: jwt_payload.user.username,
					})
					if (!response) {
						return done(null, false, { message: 'User not found' })
					} else {
						return done(null, jwt_payload)
					}
				} catch (error) {
					done(error)
				}
			}
		)
	)
	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: GITHUB_CALLBACK_URL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await UserModel.findOne({
						email: profile?.emails[0]?.value,
					})
					if (!user) {
						const newUser = {
							first_name: profile.displayName.split(' ')[0],
							last_name: profile.displayName.split(' ')[1],
							email: profile?.emails[0]?.value,
							age: 18,
							password: crypto.randomBytes(20).toString('hex'),
						}
						let result = await UserModel.create(newUser)
						done(null, result)
					} else {
						done(null, user)
					}
				} catch (err) {
					done(err, null)
				}
			}
		)
	)

	// Strategy for user registration
	passport.use(
		'register',
		new LocalStrategy(
			{
				passReqToCallback: true,
				usernameField: 'email',
			},
			async (req, username, password, done) => {
				const { first_name, last_name, email, age } = req.body
				try {
					const user = await UserModel.findOne({ email: username })

					if (user) {
						console.log('El usuario ya existe.')
						return done(null, false, { message: 'Usuario ya existe' })
					}
					const newUser = {
						first_name,
						last_name,
						age,
						email,
						last_connection: null,
						password: createHash(password),
					}

					let result = await UserModel.create(newUser)
					return done(null, result)
				} catch (error) {
					return done('Error al crear el usuario', error)
				}
			}
		)
	)

	// Strategy for user login
	passport.use(
		'login',
		new LocalStrategy(async (username, password, done) => {
			try {
				const user = await UserModel.findOne({ email: username })
				if (!user) {
					return done(null, false, { message: 'User not found' })
				}
				if (!isValidPassword(user.password, password)) {
					return done(null, false, { message: 'Wrong password' })
				}
				// Update last_connection and save to the database
				user.last_connection = new Date()
				await user.save()
				return done(null, user)
			} catch (error) {
				return done(error)
			}
		})
	)

	passport.serializeUser((user, done) => {
		done(null, user._id)
	})

	passport.deserializeUser(async (id, done) => {
		let user = await UserModel.findById(id)
		done(null, user)
	})
}

export default initializePassport
