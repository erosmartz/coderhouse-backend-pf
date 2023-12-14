import { ticketService } from '../repositories/services.js'

// Save Ticket: Creates a new ticket
const saveTicket = async (req, res) => {
	const ticket = req.body // Ticket data from request
	const user = req.user // User details
	await ticketService.createTicket(user) // Creating a ticket for the user
	res.json(ticket) // Sending ticket details as a response
}

// Get All Tickets: Retrieves all tickets (not in use)
const getAllTickets = async (req, res) => {
	const tickets = await ticketService.getAllTickets() // Retrieve all tickets
	res.send(tickets) // Send retrieved tickets as a response
	// res.render('user', { user: users }) // Rendering tickets to the user (commented out)
}

// Get Ticket by ID: Retrieves a ticket by its ID (not in use)
const getTicketById = async (req, res) => {
	const tid = req.params.tid // Ticket ID from request
	const ticket = await ticketService.getTicketById(tid) // Retrieve ticket details by its ID
	ticket._id = ticket._id.toString() // Convert ID to string format
	res.render('finish-purchase', ticket) // Render 'finish-purchase' view with ticket details
}

// Get Ticket by User's Email: Retrieves a ticket by the user's email
const getTicketByEmail = async (req, res) => {
	const userEmail = req.user.user.user.email // User's email
	const ticket = await ticketService.getTicketByEmail(userEmail) // Retrieve ticket by user's email
	ticket._id = ticket._id.toString() // Convert ID to string format
	res.render('finish-purchase', ticket) // Render 'finish-purchase' view with ticket details
}

export { saveTicket, getAllTickets, getTicketById, getTicketByEmail }
