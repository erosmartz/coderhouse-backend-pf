import nodemailer from 'nodemailer'
import { userService } from '../repositories/services.js'
import config from '../config/config.js'

const { mailing } = config

// Configure Mailtrap
const transporter = nodemailer.createTransport({
	service: mailing.SERVICE,
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: mailing.USER,
		pass: mailing.PASSWORD,
	},
})

// Function to send email for account deletion due to inactivity
async function sendEmail(emailAddress) {
	const mailOptions = {
		from: 'erosmartz@gmail.com',
		to: emailAddress,
		subject: 'Account Deletion due to Inactivity',
		text: 'Your account has been deleted due to inactivity for a period of time.',
	}

	try {
		await transporter.sendMail(mailOptions)
		console.log(`Email sent to ${emailAddress}`)
	} catch (error) {
		console.error('Error sending email:', error)
	}
}

// Function to send email when a product is deleted for premium users
async function sendEmailToPremium(emailAddress) {
	const mailOptions = {
		from: 'erosmartz@gmail.com',
		to: emailAddress,
		subject: 'Product Deletion',
		text: 'A product you created has been deleted.',
	}

	try {
		await transporter.sendMail(mailOptions)
		console.log(`Email sent to ${emailAddress}`)
	} catch (error) {
		console.error('Error sending email:', error)
	}
}

// Function to delete inactive users
async function deleteInactiveUsers() {
	const inactivityLimit = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // Last 10 days

	try {
		const users = await userService.getAllUsers()

		const inactiveUsers = users.filter(
			(user) =>
				user.last_connection < inactivityLimit &&
				(user.role === 'user' || user.role === 'premium')
		)

		if (inactiveUsers.length > 0) {
			for (const user of inactiveUsers) {
				await sendEmail(user.email)
				await userService.deleteUser(user._id)
				console.log(
					`Email sent and user ${user.email} deleted due to inactivity`
				)
			}
		} else {
			console.log('No inactive users')
		}
	} catch (error) {
		console.error('Error finding inactive users:', error)
	}
}

// Call the function to delete inactive users and send emails
deleteInactiveUsers().catch((error) => {
	console.error('Error deleting inactive users:', error)
})

// Function to send recovery email
const sendRecoveryEmail = (emailAddress, recoveryLink) => {
	const mailOptions = {
		from: 'erosmartz@gmail.com',
		to: emailAddress,
		subject: 'Password Recovery',
		text: `Click on the following link to recover your password: ${recoveryLink}`,
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email:', error)
		} else {
			console.log('Email sent:', info.response)
		}
	})
}

export { deleteInactiveUsers, sendEmailToPremium, sendRecoveryEmail }
