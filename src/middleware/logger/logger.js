import winston from 'winston'
import config from '../../config/config.js'

// Log levels
const levels = {
	debug: 0,
	http: 1,
	info: 2,
	warning: 3,
	error: 4,
	critical: 5,
}

// Colors for log levels
winston.addColors({
	debug: 'green',
	http: 'blue',
	info: 'cyan',
	warning: 'yellow',
	error: 'magenta',
	critical: 'red',
})

// Transport to store logs in an "error.log" file
const errorTransport = new winston.transports.File({
	filename: './error.log',
	level: 'error', // Only logs error levels or above
})

// Development logger configuration
const devLogger = winston.createLogger({
	levels,
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.simple()
	),
	transports: [new winston.transports.Console({ level: 'debug' })],
})

// Production logger configuration
const prodLogger = winston.createLogger({
	levels,
	format: winston.format.simple(),
	transports: [errorTransport], // Logs errors and above to "error.log"
})

// Middleware to configure the logger in req
const loggerMiddleware = (req, res, next) => {
	if (config.app.ENV === 'production') {
		req.logger = prodLogger
	} else {
		req.logger = devLogger
	}
	next()
}

export { devLogger, prodLogger, loggerMiddleware }
