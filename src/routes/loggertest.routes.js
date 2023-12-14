import { Router } from 'express'
import { loggerMiddleware } from '../middleware/logger/logger.js'

const router = Router()

// Route for testing logs
router.get('/', loggerMiddleware, (req, res) => {
	// Log messages at different levels
	req.logger.debug('This is a DEBUG level message')
	req.logger.http('This is an HTTP level message')
	req.logger.info('This is an INFO level message')
	req.logger.warning('This is a WARNING level message')
	req.logger.error('This is an ERROR level message')
	req.logger.fatal('This is a FATAL level message')

	res.send(
		'Logs generated in the console or log file based on the environment.'
	)
})

export default router
