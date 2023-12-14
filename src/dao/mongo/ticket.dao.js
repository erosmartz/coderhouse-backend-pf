import ticketModel from '../models/ticket.model.js'

export default class TicketDao {
	constructor() {
		console.log(`Working with Database persistence for users in MongoDB`)
	}

	// Create a new ticket
	create = async (data) => {
		try {
			const newTicket = await ticketModel.create(data)
			return newTicket
		} catch (error) {
			throw new Error('Error creating the ticket: ' + error.message)
		}
	}

	// Get a ticket by its ID
	getById = async (ticketId) => {
		try {
			let ticket = await ticketModel.findById(ticketId)
			return ticket
		} catch (error) {
			throw new Error('Error getting the ticket by ID: ' + error.message)
		}
	}

	// Get a ticket by email
	getByEmail = async (userEmail) => {
		try {
			let ticket = await ticketModel.findOne({ purchaser: userEmail })
			return ticket
		} catch (error) {
			throw new Error('Error getting the ticket by email: ' + error.message)
		}
	}

	// Update a ticket
	update = async (ticketId, data) => {
		try {
			const updatedTicket = await ticketModel.findByIdAndUpdate(
				ticketId,
				data,
				{ new: true }
			)
			return updatedTicket
		} catch (error) {
			throw new Error('Error updating the ticket: ' + error.message)
		}
	}

	// Delete a ticket
	deleteTicket = async (ticketId) => {
		try {
			const deletedTicket = await ticketModel.findByIdAndDelete(ticketId)
			return deletedTicket
		} catch (error) {
			throw new Error('Error deleting the ticket: ' + error.message)
		}
	}
}
