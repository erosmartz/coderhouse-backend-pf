import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Set default value for PERSISTENCE
export const PERSISTENCE = process.env.PERSISTENCE || 'MONGO'

export default {
	// Configuration for the app
	app: {
		ENV: process.env.NODE_ENV || 'development',
	},
	// Configuration for mailing service
	mailing: {
		SERVICE: process.env.MAILING_SERVICE,
		USER: process.env.MAILING_USER,
		PASSWORD: process.env.MAILING_PASSWORD,
	},
	// Configuration for MongoDB
	mongo: {
		URL: process.env.MONGO_URL,
	},
	// Configuration for JWT authentication
	jwt: {
		NAME: process.env.COOKIE_NAME,
		SECRET: process.env.COOKIE_SECRET,
	},
	// Configuration for GitHub integration
	github: {
		CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
	},
}
