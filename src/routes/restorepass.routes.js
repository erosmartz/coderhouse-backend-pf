import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import { sendRecoveryEmail } from '../services/mailing.js'
import notifier from 'node-notifier'

const router = Router()

// Render the restore page
router.get('', (req, res) => {
	res.render('restore', {
		title: 'Restaura tu contraseña',
	})
})

// Handle the restore password request
router.post('/', async (req, res) => {
	const emailAddress = req.body.email // Send the recovery email
	const recoveryLink = `http://localhost:8080/forgot`
	sendRecoveryEmail(emailAddress, recoveryLink)
	notifier.notify({
		title: 'Email enviado',
		message: 'Un email se ha enviado a tu casilla de correo.',
		timeout: 1000,
	})
	res.json({ success: true, message: 'Recovery email sent' })
})

export default router
