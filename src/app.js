import express from 'express'
import handlebars from 'express-handlebars'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { Server } from 'socket.io'
import { createServer } from 'http'
import path from 'path'
import * as dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import cors from 'cors'
import config from './config/config.js'
import { deleteInactiveUsers } from '../src/services/mailing.js'

import LoginRoute from './routes/login.routes.js'
import SignupRoute from './routes/signup.routes.js'
import SessionRoute from './routes/session.routes.js'
import ProductRouter from './routes/product.routes.js'
import CartRouter from './routes/cart.routes.js'
import UserRouter from './routes/user.routes.js'
import LogoutRouter from './routes/logout.routes.js'
import ForgotRouter from './routes/forgot.routes.js'
import FailLogin from './routes/session.routes.js'
import FailRegister from './routes/session.routes.js'
import ChatRouter from './routes/chat.routes.js'
import UpdateProductsRouter from './routes/updateproducts.router.js'
import MockingRouter from './routes/mocking.routes.js'
import RestorePass from './routes/restorepass.routes.js'
import LoggerRouter from './routes/loggertest.routes.js'

import { loggerMiddleware } from './middleware/logger/logger.js'
import { __dirname } from './utils.js'

dotenv.config()
const COOKIE_SECRET = config.jwt.SECRET
const MONGO_URL = config.mongo.URL
const PORT = config.app.PORT || 8080

const app = express()
const httpServer = createServer(app)
app.use(cookieParser(COOKIE_SECRET))
app.use(cors())

// Static files and JSON handling
app.use(express.static('public'))
app.use(
	'/public/upload',
	express.static(path.join(__dirname, '../public/upload'))
)
app.use(
	'/public/image',
	express.static(path.join(__dirname, '../public/image'))
)
app.use(
	'/public/upload/profiles',
	express.static(path.join(__dirname, '/public/upload/profiles'))
)
app.use('/public/upload/profiles', express.static('/public/upload/profiles'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configure handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
handlebars.compileOptions = { allowProtoMethodsByDefault: true }

// Delete inactive users and send emails
deleteInactiveUsers().catch((error) => {
	console.error('Error deleting inactive users:', error)
})

// Session storage
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: MONGO_URL,
			ttl: 10,
		}),
		secret: COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
	})
)

// Initialize passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Mongoose configuration
const environment = async () => {
	try {
		await mongoose.connect(MONGO_URL)
		console.log('Connected to your MongoDB database.')
	} catch (error) {
		console.log(error)
	}
}

environment()

// Swagger Options
const SwaggerOptions = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'Project Documentation',
			description: 'Backend CODERHOUSE Course',
		},
	},
	apis: [`${__dirname}/docs/**/*.yaml`],
}

// Connect Swagger
const specs = swaggerJsdoc(SwaggerOptions)

// Route for testing logs
app.use(loggerMiddleware)
app.use('/loggertest', LoggerRouter)

// Route handling
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use('/', LoginRoute)
app.use('/signup', SignupRoute)
app.use('/api/session/', SessionRoute)
app.use('/api/products/', ProductRouter)
app.use('/logout', LogoutRouter)
app.use('/forgot', ForgotRouter)
app.use('/', FailLogin)
app.use('/', FailRegister)
app.use('/api/carts/', CartRouter)
app.use('/api/users/', UserRouter)
app.use('/chat', ChatRouter)
app.use('/api/updateproducts/', UpdateProductsRouter)
app.use('/mockingproducts', MockingRouter)
app.use('/api/restore-password/', RestorePass)

// Socket configuration (server-side)
const socketServer = new Server(httpServer)

// Configure Socket.IO connection event
socketServer.on('connection', (socket) => {
	console.log('New client connected')

	// Handle custom events
	socket.on('mensaje', (data) => {
		console.log('Received message:', data)

		// Send response to the client
		socket.emit('respuesta', 'Message received successfully')
	})

	socket.on('disconnect', () => {
		console.log('Client disconnected')
	})
})

// Start the HTTP server
httpServer.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`)
})
